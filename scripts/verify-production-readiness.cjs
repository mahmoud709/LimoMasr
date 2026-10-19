/* eslint-disable @typescript-eslint/no-require-imports -- Isolated production-safety checks with no live I/O. */
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),ts=require("typescript");
function load(file,mocks={},globals={}) { const exports={};const js=ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,jsx:ts.JsxEmit.ReactJSX}}).outputText;vm.runInNewContext(js,{exports,process:{env:{NODE_ENV:"production"},cwd:()=>process.cwd()},console:{error(){}},URL,Headers,Request,AbortSignal,FormData,Blob,Buffer,require:name=>name in mocks?mocks[name]:require(name),...globals},{filename:file});return exports; }
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);}
(async()=>{
 let clock=Date.now();class Clock extends Date { static now(){return clock;} }
 const env={ADMIN_SECRET:"qa-only-not-a-production-secret-".repeat(2)};
 const signing=load("lib/session-signing.ts",{}, {process:{env},Date:Clock});
 const token=signing.issueSession("admin","admin",60),customer=signing.issueSession("customer","012345678901234567890123",60);
 assert.equal(signing.verifySession("admin",token),"admin");assert.equal(signing.verifySession("customer",customer),"012345678901234567890123");
 for(const bad of [null,"authenticated","012345678901234567890123",token+"0","x".repeat(3000)])assert.equal(signing.verifySession("admin",bad),null);
 assert.equal(signing.verifySession("customer",token),null);clock+=61000;assert.equal(signing.verifySession("admin",token),null);
 const missing=load("lib/session-signing.ts");assert.equal(missing.verifySession("admin",token),null);assert.throws(()=>missing.issueSession("admin","admin",60),/configured/);
 let retired=0,activeHandlers=0;
 for(const p of walk("app/api/admin").concat(["app/api/migrate-db/route.ts"]).filter(p=>p.endsWith("route.ts"))){
  const source=fs.readFileSync(p,"utf8"),tree=ts.createSourceFile(p,source,ts.ScriptTarget.Latest,true);
  for(const node of tree.statements)if(ts.isFunctionDeclaration(node)&&node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)){
   if(source.includes("This maintenance endpoint is retired.")){const handler=load(p)[node.name.text];assert.equal((await handler()).status,410);retired++;}
   else if(p.replaceAll("\\","/")!=="app/api/admin/auth/route.ts"){assert(node.body.getText(tree).includes("requireAdminAuth"),p+" missing handler guard");activeHandlers++;}
  }
 }
 // External query/header flags and forged cookies cannot skip admin route checks.
 const proxy=load("proxy.ts",{"@/lib/session-signing":{verifySession:()=>null},"next/server":{NextResponse:{redirect:url=>({redirect:url.pathname}),next:()=>({next:true}),rewrite:()=>({rewrite:true})}}});
 for(const route of ["/ar/admin?__locale=ar","/en/admin/bookings","/admin?__locale=en"]){const url=new URL("https://qa.invalid"+route);assert(proxy.proxy({nextUrl:url,url:url.href,headers:new Headers({"x-locale-rewritten":"true"}),cookies:{get:()=>({value:"forged"})}}).redirect.endsWith("/admin/login"));}
 // Reads of an empty database do not seed. Empty bookings do not import local PII.
 let writes=0;const deny=()=>{writes++;throw Error("Write prohibited");};
 const db={collection:()=>({find:()=>({toArray:async()=>[]}),findOne:async()=>null,insertOne:deny,insertMany:deny})};
 const data=load("lib/data.ts",{"./mongodb":{getDb:async()=>db},"./booking-phone":load("lib/booking-phone.ts"),"./cloudinary":{deleteFromCloudinary:deny}}, {fetch:async()=>({ok:true,json:async()=>({rates:{}})})});
 for(const method of ["getCars","getFastTrackPackages","getHotels","getFlights","getHotelApartments","getBookings","getSiteSettings"])await data[method]();
 assert.equal(writes,0);
 const offline=load("lib/data.ts",{"./mongodb":{getDb:async()=>{throw Error("offline");}},"./booking-phone":load("lib/booking-phone.ts"),"./cloudinary":{}});
 await assert.rejects(offline.getBookings(),/unavailable/);
 // Concurrent Mongo requests share exactly one pending connection.
 let connections=0,resolveConnection;class Client{constructor(){connections++;}connect(){return new Promise(resolve=>{resolveConnection=()=>resolve(this);});}db(){return{};}close(){return Promise.resolve();}}
 const mongo=load("lib/mongodb.ts",{mongodb:{MongoClient:Client}},{process:{env:{NODE_ENV:"production",MONGODB_URI:"mongodb://qa.invalid"}}});
 const calls=Array.from({length:30},()=>mongo.getDb());assert.equal(connections,1);resolveConnection();await Promise.all(calls);
 // Actual public booking handlers, with mocked persistence.
 let failed=false,saves=[],notifications=[];
 const route=load("app/api/bookings/route.ts",{"@/lib/request-json":load("lib/request-json.ts"),"@/lib/booking-phone":load("lib/booking-phone.ts"),"@/lib/data":{getBookings:async()=>[],addBooking:async b=>{if(failed)throw Error("offline");saves.push(b);},updateBooking:async()=>{}},"@/lib/eventEmitter":{eventEmitter:{emit:(...args)=>notifications.push(args)}},"@/lib/admin-auth":{requireAdminAuth:async()=>null}},{crypto:require("node:crypto").webcrypto});
 let ip=0;const payload={type:"car",customerName:"QA",phone:"+201012345678",serviceRefId:"airport-transfer-CAI",serviceName:"Cairo transfer",date:"2026-10-12",passengers:2,source:"web"};
 const post=p=>route.POST(new Request("https://qa.invalid/api/bookings",{method:"POST",headers:{"x-forwarded-for":String(++ip)},body:JSON.stringify(p)}));
 for(const patch of [{type:"bad"},{customerName:{$gt:""}},{serviceName:""},{date:"2026-02-30"},{passengers:0},{passengers:1.5},{notes:"x".repeat(8001)},{price:-1},{source:"bad"},{dateFrom:"2026-10-20",dateTo:"2026-10-10"}])assert.equal((await post({...payload,...patch})).status,400);
 failed=true;assert.equal((await post(payload)).status,503);assert.equal(notifications.length,0);assert.equal(saves.length,0);failed=false;
 for(const code of ["CAI","SPX"]){const response=await post({...payload,serviceRefId:"airport-transfer-"+code,serviceName:code+" pickup/drop-off"});assert.equal(response.status,201);const saved=await response.json();assert(saved.id);assert.equal(saved.serviceRefId,"airport-transfer-"+code);}
 assert.equal(saves.length,2);assert.equal(notifications.length,2);
 const tooLarge=await post({...payload,notes:"x".repeat(40000)});assert.equal(tooLarge.status,400);
 // Disabled customer APIs never infer booking ownership from accounts, phones or IDs.
 let customerIO = 0, customerDenied = 0;
 const forbiddenIO = () => { customerIO++; throw Error("Customer booking I/O prohibited"); };
 const policy = load("lib/customer-booking-access.ts");
 const customerRoute = load("app/api/customer/bookings/route.ts", {"@/lib/customer-booking-access":policy, "@/lib/mongodb":{getDb:forbiddenIO}, "@/lib/data":{getBookings:forbiddenIO,updateBooking:forbiddenIO}, "next/headers":{cookies:forbiddenIO}});
 const signedCustomer = signing.issueSession("customer","012345678901234567890123",60);
 assert.equal(signing.verifySession("customer",signedCustomer),"012345678901234567890123");
 for (const locale of ["ar","en"]) for (const cookie of ["","customer-token=malformed","customer-token=012345678901234567890123","customer-token="+signedCustomer,"admin-token="+signing.issueSession("admin","admin",60)]) for (const method of ["GET","PUT"]) {
   const request = new Request("https://qa.invalid/api/customer/bookings?phone=%2B201012345678&id=another-customer&phoneVerified=true", {method,headers:{"cookie":cookie,"accept-language":locale},...(method==="PUT"?{body:JSON.stringify({id:"another-customer",customerId:"012345678901234567890123",phone:"+201012345678",phoneVerified:true,status:"cancelled"})}:{})});
   const response = await customerRoute[method](request); assert.equal(response.status,403);assert.equal(response.headers.get("cache-control"),"no-store");
   const body = await response.json();assert.equal(body.code,policy.CUSTOMER_BOOKING_DISABLED_CODE);assert.equal(body.error,policy.customerBookingMessages[locale].description);assert(!("bookings" in body));assert(!("customer" in body));customerDenied++;
 }
 for (const status of ["cancelled","confirmed","completed"]) for (const locale of ["ar","en"]) {assert.equal((await customerRoute.PUT(new Request("https://qa.invalid/api/customer/bookings",{method:"PUT",headers:{"accept-language":locale},body:JSON.stringify({id:"another-customer",status,phoneVerified:true})}))).status,403);customerDenied++;}
 assert.equal(customerIO,0);
 // Authorized admin booking management remains available independently of customer policy.
 assert.equal((await route.GET()).status,200);
 let adminPatch;
 const adminRoute = load("app/api/bookings/route.ts",{"@/lib/request-json":load("lib/request-json.ts"),"@/lib/booking-phone":load("lib/booking-phone.ts"),"@/lib/data":{getBookings:async()=>[{id:"qa",status:"new"}],updateBooking:async(id,update)=>{adminPatch={id,update};}},"@/lib/eventEmitter":{eventEmitter:{emit:()=>{}}},"@/lib/admin-auth":{requireAdminAuth:async()=>null}});
 assert.equal((await adminRoute.PUT(new Request("https://qa.invalid/api/bookings",{method:"PUT",body:JSON.stringify({id:"qa",status:"confirmed"})}))).status,200);assert.equal(adminPatch.id,"qa");assert.equal(adminPatch.update.status,"confirmed");
 const React=require("react"),ReactDOMServer=require("react-dom/server");
 const portal=load("components/MyBookingsClient.tsx",{"@/lib/customer-booking-access":policy,"next/link":props=>React.createElement("a",{href:props.href},props.children)});
 for(const locale of ["ar","en"]){const html=ReactDOMServer.renderToStaticMarkup(React.createElement(portal.MyBookingsClient,{locale}));assert(html.includes(policy.customerBookingMessages[locale].title));assert(html.includes("/"+locale+"/contact"));assert(!html.includes("<form"));assert(!html.includes("phoneVerified"));}
 console.log("PASS: "+customerDenied+" disabled customer read/change/cancellation cases with zero I/O; bilingual portal; authorized admin management preserved.");
 // Foreign-content and encoded/malformed sanitizer payloads stay inert after reparse.
 const parser=load("lib/sanitize.ts",{parse5:await import("parse5")});
 const attacks=['<svg><script>alert(1)</script></svg>','<math><mtext><img src=x onerror=alert(1)></mtext></math>','<a href="java&#x0a;script:alert(1)" onclick=alert(1)>x</a>','<iframe srcdoc="<script>alert(1)</script>"></iframe>','<table><div><img src="/safe.jpg" onerror="alert(1)"></div></table>','<img src="data:image/svg+xml,evil">'];
 for(const attack of attacks){const clean=parser.sanitizeHtml(attack);assert(!/<(?:script|svg|math|iframe)\b|onerror=|onclick=|javascript:|data:image/.test(clean));assert.equal(parser.sanitizeHtml(clean),clean);}

 // Cloudinary credentials must come from configuration; missing settings never upload.
 let uploads=0;
 const cloudMissing=load("lib/cloudinary.ts",{}, {fetch:async()=>{uploads++;throw Error("Unexpected upload");}});
 await assert.rejects(cloudMissing.uploadToCloudinary("qa"),/not configured/);assert.equal(uploads,0);
 const configuredCloud=load("lib/cloudinary.ts",{}, {process:{env:{CLOUDINARY_URL:"cloudinary://qa-key:qa-test-only-secret@qa-cloud"}},fetch:async(url,options)=>{uploads++;assert.equal(url,"https://api.cloudinary.com/v1_1/qa-cloud/image/upload");assert.equal(options.body.get("api_key"),"qa-key");assert(options.body.get("signature"));return {ok:true,json:async()=>({secure_url:"https://qa.invalid/test.jpg"})};}});
 assert.equal(await configuredCloud.uploadToCloudinary("qa"),"https://qa.invalid/test.jpg");assert.equal(uploads,1);

 // Configuration checks never print credential values or contact a database.
 const {validateRuntimeConfig}=require("./verify-runtime-config.cjs");
 assert.equal(validateRuntimeConfig({}).valid,false);
 const settings={MONGODB_URI:"mongodb://qa-only.invalid/limo",ADMIN_SECRET:require("crypto").randomBytes(32).toString("hex"),ADMIN_PASSWORD:"qa-only-owner-approved",NEXT_PUBLIC_GA4_ID:"G-MSXWFZ24ES",CLOUDINARY_CLOUD_NAME:"qa-only",CLOUDINARY_API_KEY:"qa-only-key",CLOUDINARY_API_SECRET:"qa-only-secret"};
 assert.equal(validateRuntimeConfig(settings).valid,true);
 assert.equal(validateRuntimeConfig({...settings,ADMIN_SECRET:"change-me".repeat(10)}).valid,false);
 assert.equal(validateRuntimeConfig({...settings,CUSTOMER_SESSION_SECRET:"short"}).valid,false);
 assert.equal(validateRuntimeConfig({...settings,CLOUDINARY_CLOUD_NAME:"",CLOUDINARY_API_KEY:"",CLOUDINARY_API_SECRET:"",CLOUDINARY_URL:"cloudinary://qa-key:qa-secret@qa-cloud"}).valid,true);
 assert(!JSON.stringify(validateRuntimeConfig({...settings,MONGODB_URI:"invalid-sensitive-value"})).includes("invalid-sensitive-value"));
 // The staging validator refuses absent/shared clusters before creating a client.
 let stagingClients=0, stagingWrites=0;
 class ReadOnlyStagingClient {constructor(){stagingClients++;}async connect(){} db(){return {command:async()=>({ok:1}),listCollections:()=>({toArray:async()=>[{name:"cars"},{name:"bookings"}]}),collection:()=>({insertOne:()=>{stagingWrites++;throw Error("Write forbidden");}})};}async close(){}}
 async function runStaging(env){const fakeProcess={env,cwd:()=>process.cwd(),exitCode:0};await vm.runInNewContext(fs.readFileSync("scripts/verify-staging-db.cjs","utf8"),{URL,process:fakeProcess,console:{log(){},error(){}},require:name=>name==="mongodb"?{MongoClient:ReadOnlyStagingClient}:{loadEnvConfig(){}}});return fakeProcess.exitCode;}
 assert.equal(await runStaging({}),1);assert.equal(stagingClients,0);
 assert.equal(await runStaging({MONGODB_URI:"mongodb://prod.invalid/limo",STAGING_MONGODB_URI:"mongodb://prod.invalid/other"}),1);assert.equal(stagingClients,0);
 assert.equal(await runStaging({MONGODB_URI:"mongodb://prod.invalid/limo",STAGING_MONGODB_URI:"mongodb://staging.invalid/limo"}),0);assert.equal(stagingClients,1);assert.equal(stagingWrites,0);
 console.log("PASS: redacted runtime configuration; absent/shared staging clusters rejected; staging checks read-only with mocked I/O.");
 console.log("PASS: signed/expired/tampered sessions; "+retired+" retired handlers, "+activeHandlers+" admin guards; proxy bypass; zero read-triggered writes; offline booking reads; 30 concurrent Mongo callers; CAI/SPX persistence contract, invalid payloads/storage failures and sanitizer payloads. All I/O mocked.");
})().catch(error=>{console.error(error);process.exitCode=1;});
