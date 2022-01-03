import * as React from "react";
import "./grading.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Docviewer from "./docviewer";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingScreen } from "../../global_ui/spinner/spinner";
import { getUploadedFileByPath } from "../../student/services/storageServices";
import { getAllStudentsData, getCoeDeadline, getMarks,postMarks} from "../services/facultyServices";

import { useAuth } from "../../context/AuthContext";
import Dialog from "../../global_ui/dialog/dialog";

const Grading = () => {
  let location = useLocation();
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState(
    location.state.path.split("/")[location.state.path.split("/").length - 3]
  );
  const [rollNo, setRollNo] = React.useState(
    location.state.path.split("/")[location.state.path.split("/").length - 1]
  );
  const [midNo, setMid] = React.useState("1");

  let navigate = useNavigate();
  const [setDialog, setSetDialog] = useState();
  const [url, setUrl] = React.useState(null);   
  const [remarks1, setRemarks1] = useState("");
  const [remarks2, setRemarks2] = useState('')

  const [pageLoading, setPageLoading] = React.useState();
  const [pageLoadError, setPageLoadError] = React.useState();

  const [innovation1, setInnovation1] = React.useState();
  const [subRel1, setSubRel1] = React.useState();
  const [individuality1, setIndividuality1] = React.useState();
  const [preparation1, setPreparation1] = React.useState();
  const [presentation1, setPresentation1] = React.useState();
  const [innovation2, setInnovation2] = React.useState();
  const [subRel2, setSubRel2] = React.useState();
  const [individuality2, setIndividuality2] = React.useState();
  const [preparation2, setPreparation2] = React.useState();
  const [presentation2, setPresentation2] = React.useState();
  const [deadline, setdeadline] = useState();
  const [allStudents, setAllStudents] = useState();

  function validateMarks(x) {
    if(parseInt(x)===1 || parseInt(x)===2 || parseInt(x)===3)
    {
      return true;
    }
    else
    {
      return false;
    }    
  }

  async function updateMarks(){
    let marks={};
    if(midNo==="1"){
      if(validateMarks(individuality1) && validateMarks(innovation1) && validateMarks(preparation1) &&
      validateMarks(presentation1) && validateMarks(subRel1)){
        marks.Individuality1=parseInt(individuality1);
        marks.Innovation1=parseInt(innovation1);
        marks.Preparation1=parseInt(preparation1);
        marks.Presentation1=parseInt(presentation1);
        marks.Subject_Relevance1=parseInt(subRel1);
      }else{
        marks=null;
      }
     
    }
    else{
      if(validateMarks(individuality2) && validateMarks(innovation2) && validateMarks(preparation2) &&
      validateMarks(presentation2) && validateMarks(subRel2))
      {
      marks.Individuality2=parseInt(individuality2);
      marks.Innovation2=parseInt(innovation2);
      marks.Preparation2=parseInt(preparation2);
      marks.Presentation2=parseInt(presentation2);
      marks.Subject_Relevance2=parseInt(subRel2);
    } 
    else {
      marks=null;
    }
  }   

  if(marks!=null)
  {
    const res = await postMarks(
      currentUser.email,location.state.className,rollNo,midNo,marks,
      midNo==="1"?remarks1:remarks2
    ); 

    if(res==null){
      setSetDialog(`Mid ${midNo} Marks Updated Successfully`);
    }else{
      setSetDialog(null);
        }
  }
}

  async function searchRoll(){
    if(rollNo!=null || rollNo!==""){
      let x=allStudents.find(element=>element.id===rollNo)
      if(x==null){
        alert("Student Not Found")
      }else{
        console.log(x);
        setRollNo(x.id);
        if(x.data["mid1"]!=null){
          setIndividuality1(x.data["mid1"]["Individuality1"]);
          setInnovation1(x.data["mid1"]["Innovation1"]);
          setPreparation1(x.data["mid1"]["Preparation1"]);
          setPresentation1(x.data["mid1"]["Presentation1"]);
          setSubRel1(x.data["mid1"]["Subject_Relevance1"]);          
        }else{
          setIndividuality1();
          setInnovation1();
          setPreparation1();
          setPresentation1();
          setSubRel1(); 
        }
        if(x.data["mid2"]!=null){
          setIndividuality2(x.data["mid2"]["Individuality2"]);
          setInnovation2(x.data["mid2"]["Innovation2"]);
          setPreparation2(x.data["mid2"]["Preparation2"]);
          setPresentation2(x.data["mid2"]["Presentation2"]);
          setSubRel2(x.data["mid2"]["Subject_Relevance2"]);          
        }
        else{
          console.log("fjf");
          setIndividuality2();
          setInnovation2();
          setPreparation2();
          setPresentation2();
          setSubRel2();
        }
        if(x.data["remarks1"]!=null){
          setRemarks1(x.data["remarks1"]);
        }else{
          setRemarks1("")
        }
        if(x.data["remarks2"]!=null ){
          setRemarks2(x.data["remarks2"])
        }else{
          setRemarks2("")
        }
        const res = await getUploadedFileByPath(
          location.state.path.slice(0,location.state.path.length-12)+midNo+"/"+rollNo    
        );    
        if(res.error==null){
          setUrl(res.url);     
        }
        else{
          setUrl(null);
        }   
      }
    }else{
      console.log("Show Error");
    }
  }    

  async function getUserData() {
    setPageLoading(true);   
    const response = await getMarks(
      currentUser.email,location.state.className,
      location.state.path.split("/")[location.state.path.split("/").length-1]
    );
    if(response.error==null){  
        if(response.data['mid1']){  
        setIndividuality1(response.data["mid1"]["Individuality1"]);
        setInnovation1(response.data["mid1"]["Innovation1"]);
        setPreparation1(response.data["mid1"]["Preparation1"]);
        setPresentation1(response.data["mid1"]["Presentation1"]);
        setSubRel1(response.data["mid1"]["Subject_Relevance1"]);
      }
      if (response.data["mid2"]) {
        setIndividuality2(response.data["mid2"]["Individuality2"]);
        setInnovation2(response.data["mid2"]["Innovation2"]);
        setPreparation2(response.data["mid2"]["Preparation2"]);
        setPresentation2(response.data["mid2"]["Presentation2"]);
        setSubRel2(response.data["mid2"]["Subject_Relevance2"]);
      }
      if(response.data["remarks1"]!=null){
        setRemarks1(response.data["remarks1"]);
      }
      if(response.data["remarks2"]!=null){
        setRemarks2(response.data["remarks2"])
      }      
    }
    const res = await getUploadedFileByPath(
      location.state.path  
    );    
    if(res.error==null){
      setUrl(res.url);     
    }
    else{
      setUrl(null);
    }
    const coeDeadLine = await getCoeDeadline(midNo);
    if(coeDeadLine.error==null){
      setdeadline(coeDeadLine.data.toDate());
    } else {
      setdeadline(null);
    }
    const data = await getAllStudentsData(currentUser.email,location.state.className);
    if(data.error==null)
    {
      let students=[];
      data.data.forEach(element => {
        let s={};
        s.id = element.id;
        s.data=element.data();              
        students.push(s);      
      });
      setAllStudents(students);      
    }
    else{
      setAllStudents(null);
    }
    if(res.error!=null && response.error!=null && data.error!=null){
      console.log(res.error,response.error);
      setPageLoadError("Error in Fetching details");
    }
    setPageLoading(false);
  }

  useEffect(() => {
    if (currentUser.isMid1) {
      setMid("1");
    } else if (currentUser.isMid2) {
      setMid("2");
    }
    getUserData();
  }, []);

  return !pageLoading ? (
    pageLoadError == null ? (
      <div className="grading">
        {setDialog != null && (
          <Dialog message={setDialog} onOK={() => setSetDialog(null)} />
        )}
        <div className="left">
          <i
            style={{
              position: "absolute",
              left: "16px",
              top: "16px",
              cursor: "pointer",
            }}
            className="fas fa-arrow-left"
            onClick={() => {
              navigate("/faculty/studentlist", {
                state: { sub: location.state.className },
              });
            }}
          ></i>

          <h3 style={{ textAlign: "center" }}>Student Details</h3>

          <div className="details">
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <span>Roll no:</span>
              <div>
                <input
                className="rollNo"
                  type="text"
                  maxLength={10}
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                ></input>
                <button className="searchBtn" onClick={searchRoll}>
                  <i style={{ cursor: "pointer" }} className="fa fa-search"></i>
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "8px 8px 0px 8px",
              }}
            >
              <span>Subject:</span>
              <span style={{ fontWeight: "bold" }}>{subject}</span>
            </div>
          </div>

          <div className="mid1">
            <span className="mid1title">MID-I</span>
            <div>
              <span>Innovation:(2M)</span>
              <input
                className="inputStyle"
                type="number"
                maxLength={1}
                disabled={!currentUser.isMid1}
                value={innovation1}
                onChange={(e) => {
                  if (e.target.value < 3 && e.target.value > -1) {
                    setInnovation1(e.target.value);
                  } else {
                    setInnovation1(2);
                  }
                }}
              />
            </div>
            <div>
              <span>Subject Relevance:(2M)</span>
              <input
                className="inputStyle"
                type="number"
                maxLength={1}
                disabled={!currentUser.isMid1}
                value={subRel1}
                onChange={(e) => {
                  if (e.target.value < 3 && e.target.value > -1) {
                    setSubRel1(e.target.value);
                  } else {
                    setSubRel1(2);
                  }
                }}
              />
            </div>
            <div>
              <span>Individuality:(2M)</span>
              <input
                className="inputStyle"
                type="number"
                maxLength={1}
                disabled={!currentUser.isMid1}
                value={individuality1}
                onChange={(e) => {
                  if (e.target.value < 3 && e.target.value > -1) {
                    setIndividuality1(e.target.value);
                  } else {
                    setIndividuality1(2);
                  }
                }}
              />
            </div>
            <div>
              <span>Preparation:(2M)</span>
              <input
                className="inputStyle"
                type="number"
                maxLength={1}
                disabled={!currentUser.isMid1}
                value={preparation1}
                onChange={(e) => {
                  if (e.target.value < 3 && e.target.value > -1) {
                    setPreparation1(e.target.value);
                  } else {
                    setPreparation1(2);
                  }
                }}
              />
            </div>
            <div>
              <span>Presentation:(2M)</span>
              <input
                className="inputStyle"
                type="number"
                maxLength={1}
                disabled={!currentUser.isMid1}
                value={presentation1}
                onChange={(e) => {
                  if (e.target.value < 3 && e.target.value > -1) {
                    setPresentation1(e.target.value);
                  } else {
                    setPresentation1(2);
                  }
                }}
              />
            </div>
            <div
              style={{
                marginTop: "4%",
                justifyContent: "space-between",
                marginRight: "3px",
                fontWeight: "bolder",
              }}
            >
              <span>TOTAL:(10M)</span>
              <span
                style={{
                  backgroundColor: "#E5E4E2",
                  color: "black",
                  width: "40px",
                  padding: "3px",
                  height: "20px",
                  textAlign: "center",
                  borderRadius: "10px",
                }}
              >
                {parseInt(individuality1) +
                parseInt(subRel1) +
                parseInt(innovation1) +
                parseInt(preparation1) +
                parseInt(presentation1)
                  ? parseInt(individuality1) +
                    parseInt(subRel1) +
                    parseInt(innovation1) +
                    parseInt(preparation1) +
                    parseInt(presentation1)
                  : " "}
              </span>
            </div>
          </div>

          {midNo === "2" && (
            <div className="mid2">
              <span className="mid1title">MID-II</span>
              <div>
                <span>Innovation:(2M)</span>
                <input
                  className="inputStyle"
                  type="number"
                  maxLength={1}
                  disabled={!currentUser.isMid2}
                  value={innovation2}
                  onChange={(e) => {
                    if (e.target.value < 3 && e.target.value > -1) {
                      setInnovation2(e.target.value);
                    } else {
                      setInnovation2(2);
                    }
                  }}
                />
              </div>

              <div>
                <span>Subject Relevance:(2M)</span>
                <input
                  className="inputStyle"
                  disabled={!currentUser.isMid2}
                  type="number"
                  maxLength={1}
                  value={subRel2}
                  onChange={(e) => {
                    if (e.target.value < 3 && e.target.value > -1) {
                      setSubRel2(e.target.value);
                    } else {
                      setSubRel2(2);
                    }
                  }}
                />
              </div>

              <div>
                <span>Individuality:(2M)</span>
                <input
                  className="inputStyle"
                  disabled={!currentUser.isMid2}
                  type="number"
                  maxLength={1}
                  value={individuality2}
                  onChange={(e) => {
                    if (e.target.value < 3 && e.target.value > -1) {
                      setIndividuality2(e.target.value);
                    } else {
                      setIndividuality2(2);
                    }
                  }}
                />
              </div>

              <div>
                <span>Preparation:(2M)</span>
                <input
                  className="inputStyle"
                  disabled={!currentUser.isMid2}
                  type="number"
                  maxLength={1}
                  value={preparation2}
                  onChange={(e) => {
                    if (e.target.value < 3 && e.target.value > -1) {
                      setPreparation2(e.target.value);
                    } else {
                      setPreparation2(2);
                    }
                  }}
                />
              </div>

              <div>
                <span>Presentation:(2M)</span>
                <input
                  className="inputStyle"
                  disabled={!currentUser.isMid2}
                  type="number"
                  maxLength={1}
                  value={presentation2}
                  onChange={(e) => {
                    if (e.target.value < 3 && e.target.value > -1) {
                      setPresentation2(e.target.value);
                    } else {
                      setPresentation2(2);
                    }
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: "4%",
                  justifyContent: "space-between",
                  marginRight: "3px",
                  fontWeight: "bolder",
                }}
              >
                <span>Total:(10M)</span>
                <span
                  style={{
                    backgroundColor: "#E5E4E2",
                    color: "black",
                    width: "40px",
                    padding: "3px",
                    height: "20px",
                    textAlign: "center",
                    borderRadius: "10px",
                  }}
                >
                  {parseInt(individuality2) +
                  parseInt(subRel2) +
                  parseInt(innovation2) +
                  parseInt(preparation2) +
                  parseInt(presentation2)
                    ? parseInt(individuality2) +
                      parseInt(subRel2) +
                      parseInt(innovation2) +
                      parseInt(preparation2) +
                      parseInt(presentation2)
                    : " "}
                </span>
              </div>
            </div>
          )}

          <div className="footer">
            <i
              className="fas fa-chevron-circle-left fa-2x"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              className="fas fa-chevron-circle-right fa-2x"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        </div>

        <div className="right">
          <div
            className="preview"
            style={{
              display: "grid",
              gridTemplateColumns: "0.3fr 0.3fr 0.3fr",
            }}
          >
        
          <span
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                padding: "16px",
                gridArea: "title",
                alignSelf: "center",
              }}
            >
              PREVIEW
            </span>

            <div
              className="dropdown"
              style={{
                alignSelf: "end",
                padding: "16px",
                justifySelf: "end",
              }}
            >
              <i className="fa fa-angle-down dropdown-i" aria-hidden="true"></i>
              <select
                style={{
                  width: "200px",
                  padding: "8px",
                  borderRadius: "24px",
                  marginRight: "12px",
                }}
                value={midNo}
                onChange={(e) => setMid(e.target.value)}
                name="selectList"
                id="selectList"
              >
                <option value="1">MID-I</option> 
                {!currentUser.mid1 && <option value="2">MID-II</option>}
              </select>
            </div>

            

            <div className="display">
              {url !== null ? (
                <Docviewer link={url} />
              ) : (
                <div>Unknown Error Occured</div>
              )}
            </div>

              <div className="remarksCon">
                <span className="remarks-title">REMARKS</span>
                <textarea 
                value={midNo==="1"?remarks1:remarks2}
                onChange={
                  (e)=>midNo==="1"?setRemarks1(e.target.value):setRemarks2(e.target.value)
                }
                rows={3} className="remarks" style={{ resize: "none", backgroundColor:"#bbe8ff", opacity:"0.7"}} />
                {/* {
                  deadline!=null?
                  (
                    new Date()<deadline?
                    <button    className="savebutton"          
                      
                      onClick={()=>updateMarks()}
                    >SAVE</button>:
                    <div style={{textAlign:'center'}}>COE Deadline exceeded, cannot update marks</div>
                  )
                    :<button className="savebutton"
                     
                      onClick={()=>updateMarks()}
                    >SAVE</button>
                } */}
                {
                  <button className="savebutton"
                  onClick={()=>updateMarks()}
                  disabled={!currentUser.isMid1 && !currentUser.isMid2}>{!currentUser.isMid1 && !currentUser.isMid2}SAVE</button>
                }
              </div>
          </div>
        </div>
      </div>
    ) : (
      <div>{pageLoadError}</div>
    )
  ) : (
    <LoadingScreen />
  );
};

export default Grading;