import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { callApi } from '../utils/callApi';
import UserContext from '../context/UserContext'
import ReactMarkDown from 'react-markdown'


function CourseDetail() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [course, setCourse] = useState({});
    const navigate = useNavigate();
    const { auth } = useContext(UserContext)
    const { id } = useParams(); // Get the course ID from the URL


    useEffect(() => {
        //  get specific course data from api
        const getCourses = async () => {
            try {
                const resp = await callApi(`/courses/${id}`, 'GET');
                if (resp.status === 200) {
                    const course = await resp.json();
                    setCourse(course);
                    setIsLoaded(true)
                } else if (resp.status === 404) {
                    throw new Error('Course was not found');
                }
            } catch (e) {
                console.log(`Error: ${e}`)
                throw new Error(`There was an error while getting data: ${e}`);
            }
        }
        getCourses();
    }, [id, navigate]);

    // delete course if user authorized
    const handleDelete = async () => {
        try {
            const resp = await callApi(`/courses/${id}`, 'DELETE', null, auth);
            if (resp.status === 204) {
                navigate('/');
            } else if (resp.status === 403) {
                throw new Error('To delete courses you first need to sign in');
            }
        } catch (e) {
            console.log(`Error: ${e}`)
            throw new Error(`There was an error while attempting to delete data: ${e}`)
        }
    };
    
    if (isLoaded) {
        return (
            <>
                <div className="actions--bar">
                    <div className="wrap">
                        {
                            auth && auth.id === course.userId ?
                                <>
                                    <Link className="button" to={`/courses/${id}/update`}>Update Course</Link>
                                    <button className="button" onClick={handleDelete}>Delete Course</button>
                                </> : null
                        }
                        <Link className="button button-secondary" to="/">Return to List</Link>
                    </div>
                </div>
                <div className="wrap">
                    <h2>Course Detail</h2>
                    <div className="main--flex">
                        <div>
                            <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{course.title}</h4>
                            <p>By {course.user.firstName} {course.user.lastName}</p>
                            <ReactMarkDown children={course.description} />
                        </div>
                        <div>
                            <h3 className="course--detail--title">Estimated Time</h3>
                            <p>{course.estimatedTime}</p>

                            <h3 className="course--detail--title">Materials Needed</h3>
                            <ul className="course--detail--list">
                                <ReactMarkDown children={course.materialsNeeded} />
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default CourseDetail;