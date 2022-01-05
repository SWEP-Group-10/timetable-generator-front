import { useState } from 'react';

export default function useCourses(initialValue) {
   const [courses, updateCourses] = useState(initialValue);

   let currentCourse = courses;

   const getTableCourses = () => currentCourse;

   const setTableCourses = newCourse => {
    currentCourse = newCourse;
    updateCourses(newCourse);
      return currentCourse;
   }

   return {
      getTableCourses,
      setTableCourses,
   }
}