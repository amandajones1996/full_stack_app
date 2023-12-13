
import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { callApi } from '../utils/callApi';
import UserContext from '../context/UserContext';


function UpdateCourse() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [course, setCourse] = useState(null);
    const { auth } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);
    const [errors, setErrors] = useState([]);

    // get and render course selected to be updated
    useEffect(() => {
        // get current course details
        const getCourse = async () => {
            try {
                const resp = await callApi(`/courses/${id}`, 'GET');
                if (resp.status === 200) {
                    const course = await resp.json();
                    console.log(course)
                    console.log(auth)
                    if (course.userId !== auth.id) {
                        console.log(`To update ${course.title} you must be the owner.`)
                    } else if (resp.status === 404) {
                        throw Error('Course not found.')
                    } else {
                        setCourse(course);
                        setIsLoaded(true);
                    }
                }
            } catch (e) {
                throw Error(`Error: ${e}`);
            }
        }
        getCourse();
    }, [id, navigate, auth.id]);

    // navigate back home if cancel button is selected
    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    };

    // make put call to backend 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseContent = {
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
            userId: auth.id
        }
        console.log(courseContent)
        const resp = await callApi(`/courses/${id}`, 'PUT', courseContent, auth);
        try {
            if (resp.status === 204) {
                console.log('course created!');
                navigate(`/courses/${id}`);
            } else if (resp.status === 404) {
                throw Error(`Course with id ${courseContent.userId} could not be found`);
            }else if(resp.status === 400){
                const errorData = await resp.json();
                setErrors(errorData.errors);
            }
        } catch (e) {
            throw Error('Error while processing your request');
        }
    };
    if (isLoaded) {
        return (
            <div className="wrap">
                <h2>Update Course</h2>
                { errors.length ?
                    <div className="validation--errors">
                        <h3>Validation Errors</h3>
                        <ul>
                        {errors.map((error) => <li>{error}</li>)}
                        </ul>
                    </div>
                    : null
                }
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="title">Course Title</label>
                            <input id="title" name="title" type="text" ref={title} defaultValue={course.title ? course.title : ''} />

                            <p>By {auth.firstName} {auth.lastName}</p>

                            <label htmlFor="description">Course Description</label>
                            <textarea id="description" name="description" ref={description} defaultValue={course.description ? course.description : ''} ></textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" ref={estimatedTime} defaultValue={course.estimatedTime ? course.estimatedTime : ''} />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded} defaultValue={course.materialsNeeded ? course.materialsNeeded : ''} ></textarea>
                        </div>
                    </div>
                    <button className="button" type="submit">Update Course</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        );
    }
}

export default UpdateCourse;