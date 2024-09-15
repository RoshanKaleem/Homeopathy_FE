import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import CourseForm from './CourseForm';
import ModuleForm from './ModuleForm';
import MaterialForm from './MaterialForm';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(false);
  const [expandedModule, setExpandedModule] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [newCourseData, setNewCourseData] = useState({ title: '', description: '' });
  const [newModuleData, setNewModuleData] = useState({ 
    title: '', 
    description: '', 
    has_quiz: false // Added has_quiz field
  });
  const [update, setUpdate] = useState(false);

  const [isEditingCourseId, setIsEditingCourseId] = useState(null); // For course editing
  const [isEditingModuleId, setIsEditingModuleId] = useState(null); // For module editing

  useEffect(() => {
    fetchCoursesWithModulesAndMaterials();
  }, [update]);

  const fetchCoursesWithModulesAndMaterials = async () => {
    try {
      const response = await axiosInstance.get('api/courses/');
      const courses = await Promise.all(
        response.data.map(async (course) => {
          const moduleResponse = await axiosInstance.get(`api/courses/${course.id}/modules/`);
          const modules = await Promise.all(
            moduleResponse.data.map(async (module) => {
              const materialResponse = await axiosInstance.get(`api/modules/${module.id}/materials/`);
              return {
                ...module,
                materials: materialResponse.data,
              };
            })
          );
          return {
            ...course,
            modules: modules,
          };
        })
      );
      setCourses(courses);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExpandCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? false : courseId);
  };

  const handleExpandModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? false : moduleId);
  };

  const handleAddCourse = async () => {
    try {
      const response = await axiosInstance.post('api/admin/courses/', newCourseData);
      // setCourses([...courses, response.data]);
      setIsAddingCourse(false);
      setNewCourseData({ title: '', description: '' });
      setUpdate(prevUpdate => !prevUpdate);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleEditCourse = async (courseId) => {
    try {
      const response = await axiosInstance.put(`api/admin/courses/${courseId}/`, newCourseData);
      setIsEditingCourseId(null);
      setUpdate(prevUpdate => !prevUpdate);
    } catch (error) {
      console.error('Error editing course:', error);
    }
  };


  // Edit module function
  const handleEditModule = async (moduleId) => {
    try {
      console.log(newModuleData)
      const response = await axiosInstance.put(`/api/admin/modulesdel/${moduleId}/`, newModuleData);
      // const updatedCourses = courses.map(course => ({
      //   ...course,
      //   modules: course.modules.map(module => module.id === moduleId ? response.data : module),
      // }));
      // setCourses(updatedCourses);
      setIsEditingModuleId(null); // Close the form after editing
      setNewModuleData({ title: '', description: '', has_quiz: false });
      setUpdate(prevUpdate => !prevUpdate);
    } catch (error) {
      console.error('Error editing module:', error);
    }
  };
  

  const handleDeleteCourse = async (courseId) => {
    try {
      await axiosInstance.delete(`api/admin/courses/${courseId}/`);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleDeleteModule = async (moduleId, courseId) => {
    try {
      await axiosInstance.delete(`api/admin/modulesdel/${moduleId}/`);
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            modules: course.modules.filter(module => module.id !== moduleId),
          };
        }
        return course;
      });
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleAddModule = async () => {
    try {
      const response = await axiosInstance.post(`api/admin/modules/${currentCourseId}/`, newModuleData);
      setNewModuleData({ title: '', description: '', has_quiz: false });
      setIsAddingModule(false);
      setUpdate(prevUpdate => !prevUpdate);
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleAddMaterial = async (materialData, moduleId) => {
    const formData = new FormData();
    formData.append('title', materialData.title);
    formData.append('material_type', materialData.material_type);
    formData.append('upload', materialData.upload);
    formData.append('module', moduleId); // Associate with the module
  
    try {
      const response = await axiosInstance.post(`api/admin/materials/${moduleId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const updatedCourses = courses.map(course => {
        return {
          ...course,
          modules: course.modules.map(module => {
            if (module.id === moduleId) {
              return { ...module, materials: [...module.materials, response.data] };
            }
            return module;
          }),
        };
      });
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };
  
  const handleDeleteMaterial = async (materialId, moduleId) => {
    try {
      await axiosInstance.delete(`api/admin/materialsdel/${materialId}/`);
      const updatedCourses = courses.map(course => {
        return {
          ...course,
          modules: course.modules.map(module => {
            if (module.id === moduleId) {
              return { ...module, materials: module.materials.filter(m => m.id !== materialId) };
            }
            return module;
          }),
        };
      });
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };
  

  const handleIconClick = (e, callback) => {
    e.stopPropagation(); // Prevents the click event from bubbling up
    callback();
  };

  const handleEditCourseClick = (courseId, course) => {
    setIsEditingCourseId(courseId);
    setNewCourseData({ title: course.title, description: course.description });
  };

  const handleEditModuleClick = (moduleId, module) => {
    setIsEditingModuleId(moduleId);
    setNewModuleData({ title: module.title, description: module.description, has_quiz: module.has_quiz });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {isAddingCourse ? (
        <CourseForm
          courseData={newCourseData}
          setCourseData={setNewCourseData}
          onSubmit={handleAddCourse}
          onCancel={() => setIsAddingCourse(false)}
        />
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setIsAddingCourse(true)}
          style={{ marginBottom: '20px' }}
        >
          Add New Course
        </Button>
      )}

      {courses.map((course) => (
        <Accordion key={course.id} expanded={expandedCourse === course.id} onChange={() => handleExpandCourse(course.id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {isEditingCourseId === course.id ? (
              <CourseForm
                courseData={newCourseData}
                setCourseData={setNewCourseData}
                onSubmit={() => handleEditCourse(course.id)}
                onCancel={() => setIsEditingCourseId(null)}
              />
            ) : (
              <>
                <Typography variant="h6">{course.title}</Typography>
                <IconButton onClick={(e) => handleIconClick(e, () => handleEditCourseClick(course.id, course))}><EditIcon /></IconButton>
                <IconButton onClick={(e) => handleIconClick(e, () => handleDeleteCourse(course.id))}><DeleteIcon /></IconButton>
              </>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{course.description}</Typography>
            {isAddingModule && currentCourseId === course.id ? (
              <ModuleForm
                moduleData={newModuleData}
                setModuleData={setNewModuleData}
                onSubmit={handleAddModule}
                onCancel={() => setIsAddingModule(false)}
              />
            ) : (
              <Button
                startIcon={<AddIcon />}
                onClick={() => { setCurrentCourseId(course.id); setIsAddingModule(true); }}
                style={{ marginTop: '10px' }}
              >
                Add New Module
              </Button>
            )}

            {course.modules.map((module) => (
              <Accordion key={module.id} expanded={expandedModule === module.id} onChange={() => handleExpandModule(module.id)} style={{ marginLeft: '20px' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {isEditingModuleId === module.id ? (
                    <ModuleForm
                      moduleData={newModuleData}
                      setModuleData={setNewModuleData}
                      onSubmit={() => handleEditModule(module.id)}
                      onCancel={() => setIsEditingModuleId(null)}
                    />
                  ) : (
                    <>
                      <Typography variant="h6">Module: {module.title}</Typography>
                      <IconButton onClick={(e) => handleIconClick(e, () => handleEditModuleClick(module.id, module))}><EditIcon /></IconButton>
                      <IconButton onClick={(e) => handleIconClick(e, () => handleDeleteModule(module.id, course.id))}><DeleteIcon /></IconButton>
                    </>
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">{module.description}</Typography>
                  <Typography variant="h6" style={{ marginTop: '10px' }}>Materials:</Typography>
                  <ul>
                  {module.materials.map((material) => (
                    <li key={material.id}>
                      <Typography variant="body2">
                        {material.title} ({material.material_type}) - 
                        <a href={material.upload} download>{material.upload.split('/').pop()}</a>
                      </Typography>
                      <IconButton onClick={(e) => handleIconClick(e, () => handleDeleteMaterial(material.id, module.id))}><DeleteIcon /></IconButton>
                    </li>
                  ))}

                  </ul>
                  <MaterialForm moduleId={module.id} onAddMaterial={handleAddMaterial} />
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AdminDashboard;
