/* eslint-disable @typescript-eslint/no-require-imports -- Exercises real shared form handlers with mocked I/O. */
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),ts=require("typescript");
function load(file,mocks={},globals={}){const exports={};const js=ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;vm.runInNewContext(js,{exports,process,URL,console:{error:()=>{}},require:name=>name in mocks?mocks[name]:require(name),...globals},{filename:file});return exports;}
const phone=load("lib/booking-phone.ts");
function formText(element){if(typeof element==="string"||typeof element==="number")return String(element);if(Array.isArray(element))return element.map(formText).join(" ");return element&&typeof element==="object"?formText(element.props?.children):"";}
function findForm(element){if(!element||typeof element!=="object")return null;if(element.type==="form")return element;for(const child of [].concat(element.props?.children||[])){const found=findForm(child);if(found)return found;}return null;}
async function scenario(type,source,status,body,number="+201012345678",delayed=false,airportTest=null){
 const events=[],stateChanges=[],requests=[],opened=[],messages=[];let index=0,release;
 const response={ok:status>=200&&status<300,status,json:async()=>{if(body===null)throw Error("Malformed response");return body;}};
 const hooks={useState:initial=>{const key=index++;const value=airportTest && key===8 ? "2026-10-15" : airportTest && key===11 ? "daily" : airportTest && key===12 ? airportTest.from : airportTest && key===13 ? airportTest.to : airportTest && initial==="arrival" ? airportTest.direction : key===0?"QA customer":key===1?number:key===6?source:typeof initial==="function"?initial():initial;return[value,next=>stateChanges.push({key,next})];},useMemo:fn=>fn(),useEffect:()=>{},useRef:value=>({current:value}),useId:()=>"qa-phone"};
 const Form=load("components/BookingForm.tsx",{
  react:hooks,"@/lib/booking-phone":phone,"@/lib/utils":{bookingMessage:params=>{messages.push(params);return "QA request";},buildWhatsappUrl:()=>"https://wa.me/2010"},
  "@/lib/gtag":{BOOKING_SUCCESS_CONVERSION_SEND_TO:"QA/booking",trackEvent:(name,params)=>events.push({name,params}),trackWhatsappClick:()=>events.push({name:"whatsapp_click"})},
  "@tanstack/react-query":{useQuery:()=>({data:null})},"next/dynamic":()=>()=>null,
 },{AbortSignal,DOMException,window:{location:{pathname:"/en/qa"},open:(...args)=>opened.push(args)},fetch:async(url,options)=>{requests.push({url,body:JSON.parse(options.body)});if(status===-1)throw Error("Network failure");if(status===-2)throw new DOMException("Timed out","TimeoutError");return delayed?new Promise(resolve=>{release=()=>resolve(response);}):response;}});
 const form=findForm(Form.BookingForm({type,serviceRefId:airportTest?"airport-transfer-"+airportTest.code:"qa-service",serviceName:"QA service",whatsappNumber:"2010",locale:"en",airportTransfer:airportTest?{code:airportTest.code,name:airportTest.name}:undefined}));assert(form);
 const first=form.props.onSubmit({preventDefault(){}});
 if(delayed){await form.props.onSubmit({preventDefault(){}});assert.equal(requests.length,1,"Concurrent submit must be locked");release();}
 await first;
 return{events,stateChanges,requests,opened,messages,rendered:formText(form)};
}
(async()=>{
 let checked=0;
 for(const type of ["car","fast_track","hotel","apartment","flight"]){
  const successful=await scenario(type,"web",201,{id:"qa-confirmed-id"});
  assert.deepEqual(successful.events.map(x=>x.name),["booking_submit_success","conversion"]);assert(successful.stateChanges.some(x=>x.key===7&&x.next===true));assert.equal(successful.requests[0].body.phone,"+201012345678");
  for(const [status,body] of [[201,{}],[201,null],[201,{id:" "}],[200,{id:"not-created"}],[500,{error:"offline"}],[503,{error:"offline"}],[401,{error:"unauthorized"}],[400,{code:"PHONE_INVALID"}],[-1,{}],[-2,{}]]){
   const failed=await scenario(type,"web",status,body);assert.equal(failed.events.length,0);assert(!failed.stateChanges.some(x=>x.key===7&&x.next===true));assert(failed.stateChanges.some(x=>x.key===2&&typeof x.next==="string"&&x.next.length));checked++;
  }
  const invalid=await scenario(type,"web",201,{id:"unused"},"+971");assert.equal(invalid.requests.length,0);assert.equal(invalid.events.length,0);checked++;
 }
 const whatsapp=await scenario("car","whatsapp",201,{id:"qa-confirmed-id"});assert.deepEqual(whatsapp.events.map(x=>x.name),["booking_submit_success","conversion","whatsapp_click"]);assert.equal(whatsapp.opened.length,1);
 const failedWhatsapp=await scenario("car","whatsapp",500,{error:"offline"});assert.equal(failedWhatsapp.events.length,0);assert.equal(failedWhatsapp.opened.length,0);
 await scenario("car","web",201,{id:"qa-confirmed-id"},"+201012345678",true);
 for(const [code,name] of [["CAI","Cairo International Airport"],["SPX","Sphinx International Airport"]]) {
  for(const direction of ["arrival","departure"]) {
   const airportTest={code,name,direction,from:"QA pickup address",to:"QA destination"};
   const result=await scenario("car","web",201,{id:"qa-airport"},"+201012345678",false,airportTest);
   assert.equal(result.requests.length,1);
   const body=result.requests[0].body;
   assert(body.notes.includes("[من: "+(direction==="arrival"?name:airportTest.from)+"]"));
   assert(body.notes.includes("[إلى: "+(direction==="departure"?name:airportTest.to)+"]"));
   assert(body.notes.includes("[المطار: "+code+"]"));
   assert(!("dateFrom" in body)); assert(!body.notes.includes("مكان السكن"));
   assert(!result.rendered.includes("Daily Rental")); assert(!result.rendered.includes("Accommodation / Residence Location"));
   assert(result.messages[0].notes.includes(name));
   const missing=await scenario("car","web",201,{id:"unused"},"+201012345678",false,{...airportTest,from:"",to:""});
   assert.equal(missing.requests.length,0);assert.equal(missing.events.length,0);
  }
 }
 console.log("PASS: 4 airport pickup/drop-off routes fix the correct endpoint, suppress stale daily state and reject missing other locations; no database/network/conversions.");
 console.log("PASS: "+checked+" failure/invalid-phone cases across five booking types; confirmed success and WhatsApp flow; concurrent submit lock. No database, network or real Google conversions.");
})().catch(error=>{console.error(error);process.exitCode=1;});