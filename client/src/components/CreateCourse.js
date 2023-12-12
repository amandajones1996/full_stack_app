
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useContext} from 'react';
import { callApi } from '../utils/callApi';
import UserContext from '../context/UserContext'

function CreateCourse() {
    const { auth } = useContext(UserContext);
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const title = useRef(null);
    const description = useRef(null);
    const materialsNeeded = useRef(null);
    const estimatedTime = useRef(null);

    const handleCancel = (event) => {
        event.preventDefault();
        navigate('/');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // make request for new course
        const newCourse = {
            title: title.current.value,
            description: description.current.value,
            materialsNeeded: materialsNeeded.current.value,
            estimatedTime: estimatedTime.current.value,
            userId: (auth ? auth.id : null)
        }

        // Post API call to backend
        try {
            const resp = await callApi('/courses', 'POST', newCourse, auth);
            if(resp.status === 201){
                console.log(`${newCourse.title} was created successfully`);
                navigate('/');
            }else if(resp.status === 400){
                const errorData = await resp.json();
                setErrors(errorData.errors);
            }
        } catch (e) {
            console.log(`Error: ${e}`);
        }
    };

    return (
       
            <div className="wrap">
                <h2>Create Course</h2>
                <div className="validation--errors">
                    <h3>Validation Errors</h3>
                    <ul>
                        {errors}
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" ref={title} />

                            <p>By {auth.User.firstName} {auth.User.lastName}</p> 

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" ref={description}></textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" ref={estimatedTime} />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded}></textarea>
                        </div>
                    </div>
                    <button className="button" type="submit">Create Course</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
    );
}

export default CreateCourse;
