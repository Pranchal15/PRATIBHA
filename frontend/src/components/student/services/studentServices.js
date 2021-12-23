import { doc,updateDoc,getDoc,query, collection, getDocs } from "firebase/firestore"; 
import {db} from '../../../firebase'


async function checkEnrollment(email) {
    let error=null;
    const userRef = doc(db, 'users', email);   
    try {
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            if(userDoc.data()["isEnrolled"]){
                error="STUDENT_ENROLLED"
            }else{
                error=null;
            }
        }else{
            error="STUDENT_NOT_VERIFIED";
        }
    } catch (e) {
        error="UNKNOWN_ERROR";        
    }
    return error;
}

async function enrollCourse(email,course_details) {
    let error=null;
    const userRef = doc(db, 'users', email);   
    try{
        await updateDoc(userRef,course_details); 
    }
    catch(e){
        console.log(e);
        error=e.toString();
    }
    return error;
}

async function getStudentData(email){
    try{
        const userRef = doc(db,"users", email);   
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            if(userDoc.data()["isEnrolled"]){
                return {document:userDoc.data(),error:null};
            }else{
                return {document:null,error:"Enroll the details to access"}
            }
        }else{
            return {document:null,error:"User not verified"}
        }       
    }
    catch(e){
        return {document:null,error:e.toString()}
    }        
}


async function getCurriculumDetails(course_details) {
    const curriculumRef=query(
        collection(
            db,`curriculum/${course_details.course}/${course_details.year}`
        )
    );
    try {
        const docs = await getDocs(curriculumRef);
        let docSnap=null;
        docs.forEach((doc) => {
            if(doc.id===`${course_details.department}`){
                docSnap=doc;
            } // "doc1" and "doc2"
        });
        if(docSnap!=null){
            console.log(docSnap.data(),10);
            let reg = [];
            let oe  = [];
            let pe  = [];
            docSnap.data()['subjects'].forEach(element => {
                reg.push({value:element.subject,label:element.subject})                                
            });
            if(docSnap.data()['open_electives']!=null){
                docSnap.data()['open_electives'].forEach(element => {
                    oe.push({value:element.subject,label:element.subject})                                
                });
            }
            if(docSnap.data()['professional_electives']!=null){
                docSnap.data()['professional_electives'].forEach(element => {
                    pe.push({value:element.subject,label:element.subject})                                
                });
            }
            console.log(pe);
            if(oe.length===0 || pe.length===0){
                return { 
                    document:[reg], 
                    error:null
                };
            }else{
                return {
                    document:[reg,oe,pe],
                    error:null
                }
            }           
        }else{
            return { document:null, error:'Give proper details to enroll'}
        } 
    } catch (error) {
        return {document:null,error:error.toString()}                
    }  
}

export {enrollCourse,checkEnrollment,getStudentData,getCurriculumDetails};