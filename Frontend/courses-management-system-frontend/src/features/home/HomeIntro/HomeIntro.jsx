import "./HomeIntro.css"
import introImage from "../../../assets/images/intro_img.png";
import { GraduationCap, CalendarClock, Award } from "lucide-react";
import Counter from "./Counter";
function HomeIntro(){
const currentYear = new Date().getFullYear();
const yearsOfExperience = currentYear - 2010;

    return (

        <section className="home-intro">
            <div className="home-intro__container">


                <div className="home-intro__content">
                    <div className="home-intro__badge reveal reveal-1">
                        Autodesk Authorized Training Center
                    </div>
                    <h1 className="home-intro__title reveal reveal-2">
                        Build Your Engineering Career with Industry Experts
                    </h1>

                    <p className="home-intro__description reveal reveal-3">
                        Master Autodesk software, BIM workflows, and engineering skills through
                        hands-on training led by certified instructors. Build real-world projects
                        and become job-ready with industry-focused courses.
                    </p>

                    <div className="home-intro__actions reveal reveal-4">

                        <button className="btn btn--primary">
                            Explore Courses
                        </button>

                        <button className="btn btn--secondary">
                            Contact Us
                        </button>

                    </div>
                    
            <div className="home-intro__stats reveal reveal-5">
                <div className="stat">
                    <Counter end={30} suffix="K+"  start={true}/>
                    <p>Students Trained</p>
                </div>

                <div className="stat">
                    <Counter end={yearsOfExperience} suffix="+" start={true} />
                    <p>Years Experience</p>
                </div>

                <div className="stat">
                     <Counter end={20} suffix="+" start={true}/>
                    <p>Professional Courses</p>
                </div>
            </div>

                </div>

               <div className="home-intro__image reveal reveal-6">
                    <div className="home-intro__blob"></div>

                    <img
                        src={introImage}
                        alt="Engineering Training"
                        className="home-intro__hero-image"
                    />

                    <div className="floating-card floating-card--students">
                      <CalendarClock className="floating-card__icon" />

                        <div>
                            
                            <p>Since 2010</p>
                        </div>
                    </div>

                    <div className="floating-card floating-card--courses">
                      <GraduationCap className="floating-card__icon" />

                        <div>
                           
                            <p>Certified Instructors</p>
                        </div>
                    </div>

                    <div className="floating-card floating-card--autodesk">
                        <Award className="floating-card__icon" />  <p>Autodesk Authorized</p>
                    </div>

                </div>

            </div>



        </section>




    );





}
export default HomeIntro;