 const types = ['human','event','object']

 export default function getRandomType(){
    return types[Math.floor(Math.random() * types.length)]
 }