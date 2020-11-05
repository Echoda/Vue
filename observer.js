const data = {
	msg: 'message',
	arr: [1,2,3],
	person: {
		name: 'sun',
		age: 18,
		hoppy:{
			a:'a'
		}
	}
}

const arrayProto = Array.prototype;     //将数组的原型保存出副本，避免后面定义变异方法时影响js原方法
const arrayMethods = Object.create(arrayProto);   //arrayMethods的隐式原型__proto__为arrayProto
['push','pop','shift','unshift','sort','reverse','splice'].forEach( function(item){
	arrayMethods[item] = function(){
		Array.prototype[item].call(this, ...arguments);
		render();
	}
} )

function createReactive(obj,key,oldValue){	
	if(Array.isArray(obj[key])){
		obj[key].__proto__ = arrayMethods;
	}
	if( Object.prototype.toString.call(obj[key]) == '[object Object]' ){
		observer(obj[key]);
	}
	Object.defineProperty(obj, key,{
		get(){
			return oldValue;
		},
		set(value){
			console.log('set');
			if(value === oldValue) {
				return;
			}
			oldValue = value;
			render();
		}
	})
}

function observer(obj){
	for(var k in obj){
		createReactive(obj,k,obj[k]);
	}
}

function $set(data,key,value){
	if(Array.isArray(data)){
		data.splice(key,1,value);
		return value;
	}
	createReactive(data,key,value);   //将value值传递过去，当手动读的时候就会触发get获取value
	render();
	return value;
}

function $delete(data,key){
	if( Array.isArray(data) ){
		const prev = data[key];
		data.splice(key,1);
		return;
	}
	delete data[key];
	render();
}

function render(){
	console.log('页面渲染啦');
}

observer(data);
