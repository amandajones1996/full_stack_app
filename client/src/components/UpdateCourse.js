
import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { callApi } from '../utils/callApi';
import UserContext from '../context/UserContext';


function UpdateCourse() {
    const [course, setCourse] = useState(null);
    const { auth } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);


    useEffect(() => {
        // get current course details
        const getCourse = async (id) => {
            try {
                const resp = await callApi(`/course/${id}`, 'GET');
                if(resp.status === 200){
                    const course = await resp.json();
                    if(course.User.id !== auth.id){
                        console.log(`To update ${course.title} you must be the owner.`)
                    } else if(resp.status === 404){
                        throw Error('Course not found.')
                    } else {
                        setCourse(course);
                    }
                }
            } catch (e){
                throw Error(`Error: ${e}`);
            }
        }
        getCourse();
    }, [id, navigate, auth.id]);

    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseContent = {
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
            userId: auth.id
        }
        const resp = await callApi(`/courses/${id}`, 'PUT', courseContent, auth);
        try{
            if(resp.status === 204){
                console.log('course created!');
                navigate(`/courses/${id}`);
            } else if (resp.status === 404){
                throw Error(`Course with id ${courseContent.userId} could not be found`);
            } 
        } catch (e){
            throw Error('Error while processing your request');
        }
    };

    return (
                <div className="wrap">
                    <h2>Update Course</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="main--flex">
                            <div>
                                <label htmlFor="title">Course Title</label>
                                <input id="title" name="title" type="text" ref={title} defaultValue={course.title ? course.title : '' } />

                                <p>By {auth.firstName} {auth.lastName}</p>

                                <label htmlFor="description">Course Description</label>
                                <textarea id="description" name="description" ref={description} defaultValue={course.description ? course.description : ''} ></textarea>
                            </div>
                            <div>
                                <label htmlFor="estimatedTime">Estimated Time</label>
                                <input id="estimatedTime" name="estimatedTime" type="text" ref={estimatedTime} defaultValue={course.estimatedTime ? course.estimatedTime : ''} />

                                <label htmlFor="materialsNeeded">Materials Needed</label>
                                <textarea id="materialsNeeded" name="materialsNeeded"ref={materialsNeeded} defaultValue={course.materialsNeeded ? course.materialsNeeded : ''} ></textarea>
                            </div>
                        </div>
                        <button className="button" type="submit">Update Course</button>
                        <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
    );
}

export default UpdateCourse;