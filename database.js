// var { JsonDB, Config } =require('node-json-db');
// var db = new JsonDB(new Config("myDataBase", true, false, '/'));
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs,addDoc, query, where,orderBy } = require('firebase/firestore');
const firebaseConfig = {
  apiKey: "AIzaSyA-4_5rHvcMOh3iY4PttN4l29iGXRDiFPI",
  authDomain: "shopee-8710c.firebaseapp.com",
  databaseURL: "https://shopee-8710c.firebaseio.com",
  projectId: "shopee-8710c",
  storageBucket: "shopee-8710c.appspot.com",
  messagingSenderId: "708925055871",
  appId: "1:708925055871:web:10676d6c233e816aca304a"
};

  const app = initializeApp(firebaseConfig);
  const db2 = getFirestore(app);

  exports.test=async ()=>{
    // pdf2base64("./doc1.pdf")
    // .then(
    //     (response) => {
    //         console.log(`data:application/pdf;base64,${response}`); //cGF0aC90by9maWxlLmpwZw==
    //     }
    // )
    // .catch(
    //     (error) => {
    //         console.log(error); //Exepection error....
    //     }
    // )
  }

  exports.pushTransection = async (userid,transaction,amont) => {
    try {
       // let numberOfElements = await db.count(`/transaction/${userid}`);
        const d = new Date();
        d = new Date(d.getTime());
        let textDate= d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
console.log(textDate);

        var obj={"userid":userid,"transaction":transaction,"amont":amont,"date":textDate}
        // db.push(`/transaction/${userid}[]`,obj);
        // await db.save();
        const FinD = collection(db2, 'FinD');
        await addDoc(FinD,obj);
        return true;

    } catch (error) {
      console.error(error);
      return error

    }
  };
  exports.get = async (userid) => {
    try {
      const FinD = query(collection(db2, 'FinD'), where("userid", "==", userid), orderBy("date"));

      const FinDSnapshot = await getDocs(FinD);
      const FinDList = FinDSnapshot.docs.map(
        function(doc){
              return doc.data();
      });



        console.log(userid);
        // var data=await db.getData(`/transaction/${userid}`);
        console.log(FinDList);
        return FinDList;
    } catch (error) {
      console.error(error);
      return error

    }
  };