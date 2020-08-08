import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormContainer from "./FormContainer";
import SummaryForm from "./forms/SummaryForm";
import axios from "axios";
import LeftSideBar from "../components/LeftSidebar/LeftSidebar";
import './ResumeBuilder.css';
import PersonalInfoForm from "./forms/PersonalInfoForm";
import CoreCompetencyForm from "./forms/CoreCompetencyForm"
import EducationForm from "./forms/EducationForm"
import CustomerServiceTemplate from "./templates/customerService/CustomerServiceTemplate"
import Experience from "./forms/Experience"
import ReferenceForm from "./forms/ReferenceForm"

export default function ResumeBuilder(props) {
  const resumeDB = {
  }
  const [selectedSection, setSelectedSection] = useState('personal_info');
  const [resumeData, setResumeData] = useState(resumeDB);
  const resumeDataOnUpdate = (data, id) => {
    setResumeData({ ...resumeData, ...data });
    axios.post('/users/resumes/${id}', {
      data: resumeData,
      id: id
    })
      .then((response) => console.log(response))
      .catch(error => console.log(error));
  }
  // axios data request
  useEffect((id) => {
    axios.get("/users/resumes/${id}").then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    })
  }, []);
  const leftSideBarOnUpdate = (value) => {
    console.log("Selected item: ", value);
    setSelectedSection(value);
  }

  const sections = [
    { id: "personal_info", title: "Personal Information", component: <PersonalInfoForm onUpdate={resumeDataOnUpdate} data={resumeData.personal_info} /> },
    { id: "summary", title: "Summary", component: <SummaryForm onUpdate={resumeDataOnUpdate} data={resumeData.summary} /> },
    { id: "educations", title: "Education", component: <EducationForm onUpdate={resumeDataOnUpdate} data={resumeData.educations} /> },
    { id: "core_competencies", title: "Core Competencies", component: <CoreCompetencyForm onUpdate={resumeDataOnUpdate} data={resumeData.core_competencies} /> },
    { id: "experience", title: "Experience", component: <Experience onUpdate={resumeDataOnUpdate} data={resumeData.experience} /> },
    { id: "references", title: "References", component: <ReferenceForm onUpdate={resumeDataOnUpdate} data={resumeData.references} /> }
  ]

  const findTitleByID = (sectionID) => {
    return (sections.find(element => element.id === sectionID)).title
  }

  const findComponentByID = (sectionID) => {
    return (sections.find(element => element.id === sectionID)).component
  }

  return (
    <Container fluid>
      <Row className="rb-container vh-100">
        <Col className="sidebar-container col-2 vh-100">
          <LeftSideBar items={sections} onUpdate={leftSideBarOnUpdate} />
        </Col>

        <Col className="bg-white col-5 vh-100">
          <FormContainer title={findTitleByID(selectedSection)}>
            {findComponentByID(selectedSection)}
          </FormContainer>
        </Col>

        <Col className="bg-light col-5 preview-container vh-100">
          <CustomerServiceTemplate data={resumeData} />
        </Col>
      </Row>
    </Container>
  );

}
