const observable=Rx.Observable.create(observer=>{
	//What observable sends to subscriber
	observer.next("Hello")
	observer.next("World")
})

observable.subscribe(val=>print(val))

const clicks=Rx.Observable.fromEvent(document,'click')
clicks.subscribe(click=>console.log(click))

//Convert promise to an observable
const promise=new Promise((resovle,reject)=>{
	setTimeout(()=>{
		resovle("Resolved!")
	}, 1000)
})

const obsvPromise=Rx.Observable.fromPromise(promise)
obsvPromise.subscribe(result=>{
	print (result)
})

const timer=Rx.Observable.timer(2000)
timer.subscribe(data=>print("Time Up!!"))
//Observable at end of its lifecycle sends completed signal
timer.finally(()=>print("Timer done!")).subscribe()

const interval=Rx.Observable.interval(1000)
// interval.subscribe(int=>print(new Date().getSeconds()))

//Another way to create an observable of static values
const mashup=Rx.Observable.of('anything',['you','want'],32,true,{cool:'stuff'})
mashup.subscribe(val=>print(val))

//Hot vs Cold Observables
//Cold Observable is one whose data is created inside of it
//It creates data when something subscribes to it

//Cold Observable
print("Cold Observable")
const cold=Rx.Observable.create(observer=>{
	observer.next(Math.random()*100000)
})
cold.subscribe(a=>print(`Subscriber A : ${a}`))
cold.subscribe(b=>print(`Subscriber B : ${b}`))

//Hot Observable
//By building value to bse sent outside of an onservable
print("Hot Observable")
const hotx=Math.random()*100000
const hot1=Rx.Observable.create(observer=>{
	observer.next(hotx)
})
hot1.subscribe(a=>print(`Subscriber A : ${a}`))
hot1.subscribe(b=>print(`Subscriber B : ${b}`))

//By building value inside --->Another way
print("Hot Observable")
hot2=cold.publish()
hot2.subscribe(a=>print(`Subscriber A : ${a}`))
hot2.subscribe(b=>print(`Subscriber B : ${b}`))
hot2.connect()

//Some Observables Do not complete on their own that may lead to memory leaks
//Ex Interval
const intervalNew=Rx.Observable.interval(500)
.finally(()=>print ("Interval Done!!"))
const subscription=intervalNew.subscribe(x=>print(x))
setTimeout(()=>{
	subscription.unsubscribe()
},3000)

//RxJs Map
//Map allows you to transform emitted value to some underlying Logic
const numbers=Rx.Observable.of(10,100,1000)
numbers.map(num=>Math.log(num)).subscribe(x=>print(x))

const jsonString='{"type":"Dog","breed":"German Shepherd"}'
const apiCall=Rx.Observable.of(jsonString)
apiCall.map(json=>JSON.parse(json)).subscribe(obj=>{
	print(obj.type)
	print(obj.breed)
})

//RxJs Do
//Perform operation on Observable without Affecting the observable
const names=Rx.Observable.of('Srijan','Garg')
names
.do(name=>print(name))
.map(name=>name.toUpperCase())
.do(name=>print(name))
.subscribe()


//RxJs Filter
const numbersNew=Rx.Observable.of(-3,5,2,-6,9,-2)
numbersNew.filter(n=> n>=0 )
.subscribe(n=>print(n))

//RxJs First
numbersNew.first()
.subscribe(n=>print(n))

//RxJs Last
numbersNew.last()
.subscribe(n=>print(n))


let mouseEvents=Rx.Observable.fromEvent(document,'mousemove')
mouseEvents
.throttleTime(1000) //Gives the first event
.debounceTime(1000) //Gives the last event
.subscribe(e=>print(e.type))

//RxJs Scan
//Emit first event as its own
clicks
.map(e=>parseInt(Math.random()*10))
.do(score=>print(`Click scored +${score}`))
.scan((highScore,score)=>highScore+score)
.subscribe(highScore=>print(`High Score +${highScore}`))

//RxJs SwitchMap
//To get data from second Observable when first is called
clicks.switchMap(click=>{
	return Rx.Observable.interval(500)
})
.subscribe(i=>print(i))

//RxJs TakeUntil
//complete an observable on basis of value of another observable
//Another way to unsubscribe without using unsubscribe
let intervalTU=Rx.Observable.interval(500)
let notifier=Rx.Observable.timer(2000)
intervalTU.takeUntil(notifier)
.finally(()=>print("Completed interval"))
.subscribe(i=>print(i))

//RxJs TakeWhile
const namesTW=Rx.Observable.of('Srijan','Pappu','Kaali','Garg')
namesTW.takeWhile(name=>name!='Kaali')
.finally(()=>print("Complete Kaali found"))
.subscribe(i=>print(i))

//RxJs Zip
//Combine Observables that are same length and connected in some way
const ying = Rx.Observable.of('peanut butter', 'mine', 'rainbows')
const yang = Rx.Observable.of('jelly', 'cheese', 'unicorns')
const combo=Rx.Observable.zip(ying,yang)
combo.subscribe(arr=>print(arr))

//Catch and Retry
const observableWithError=Rx.Observable.create(observer=>{
	observer.next('good')
	observer.next('great')
	observer.next('grand')
	throw 'Catch Me'
	observer.next('wonderful')
})
observableWithError.catch(err=>print(`Error caught ${err}`))
.retry(2)
// .subscribe(val=>print(val))
//Code runs three times Initial run and 2 retries

//RxJs ForkJoin
//Another way to merge observables
//Wait for both Observables to complete and combine last two variables together
const slowYang=yang.delay(2000)
const comboFJ=Rx.Observable.forkJoin(ying,slowYang)
comboFJ.subscribe(arr=>print(arr))

//Subject
//Emit new data as subscriber by acting as a proxy to some other data source
const subObservable=Rx.Subject.of('Hello')
let subA=subObservable.subscribe(val=>print(`Sub A : ${val}`))
let subB=subObservable.subscribe(val=>print(`Sub B : ${val}`))

//next on Subject
//Send data without relying in some source data
const subject=new Rx.Subject()
subA=subject.subscribe(val=>print(`Sub A : ${val}`))
subB=subject.subscribe(val=>print(`Sub B : ${val}`))
subject.next('Hello')
setTimeout(()=>{
	subject.next('World')
},1000)

//Multicast ---> Send values to multiple subscribers
let clickMC=clicks.do(_=>print("Do one more time!"))
//For 100 subscribers it would run code for everyone of them
let subjectMc=clickMC.multicast(()=>new Rx.Subject())
subA=subjectMc.subscribe(val=>print(`Sub A : ${val.timeStamp}`))
subB=subjectMc.subscribe(val=>print(`Sub B : ${val.timeStamp}`))
subjectMc.connect()

//Helper to print values
function print (val) {
	let el=document.createElement('p')
	el.innerText=val
	document.body.appendChild(el);
}