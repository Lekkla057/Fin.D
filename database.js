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
       
        let textDate= NOW()

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
  function NOW() {
    var d = new Date()
    var date = new Date(d.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    var aaaa = date.getUTCFullYear();
    var gg = date.getUTCDate();
    var mm = (date.getUTCMonth() + 1);

    if (gg < 10)
        gg = "0" + gg;

    if (mm < 10)
        mm = "0" + mm;

    var cur_day = aaaa + "-" + mm + "-" + gg;

    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();

    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0" + minutes;

    if (seconds < 10)
        seconds = "0" + seconds;

    return cur_day + " " + hours + ":" + minutes + ":" + seconds;

}