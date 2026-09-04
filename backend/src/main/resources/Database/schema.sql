CREATE TABLE users (
    id UUID PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    role VARCHAR(20) NOT NULL,

    enabled BOOLEAN NOT NULL default true,

    created_at TIMESTAMPTZ NOT NULL ,
    updated_at TIMESTAMPTZ NOT NULL 
);

create table category (
id UUID Primary key,

name varchar(100) not null,
description text not null ,
image_url varchar(500) not null
);


create table course(
id UUID primary key ,
name varchar(100) not null unique,
description text not null,
category_id UUID not null , 
published boolean not null default false,
hours NUMERIC(4,1) NOT NULL check (hours > 0),
lecture_count int not null check (lecture_count > 0),
image_url varchar(500),
price int not null check (price >= 0),
featured boolean not null,

constraint fk_course_category 
foreign key (category_id)
references category(id)
on delete restrict
);




create table course_batch(

id uuid primary key ,
course_id UUID not null,
instructor_id UUID not null,
name varchar(100) not null,
status varchar(20) not null,
attendance_type varchar(20) not null,
capacity int not null check (capacity > 0),
start_date timestamptz not null,
end_date timestamptz not null,


constraint fk_instructor foreign key (instructor_id) references users(id),

constraint fk_course foreign key (course_id) references course(id),

constraint chk_dates check (end_date > start_date)
);


create table review (
    user_id uuid not null,
    course_id uuid not null,
    rating int not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamptz not null,


	
    primary key (user_id, course_id),

    constraint fk_review_user
        foreign key (user_id)
        references users(id),

    constraint fk_review_course
        foreign key (course_id)
        references course(id)
);

create table wishlist (
user_id uuid not null,
course_id uuid not null,

 primary key (user_id, course_id),

    constraint fk_wishlist_user
        foreign key (user_id)
        references users(id),

    constraint fk_wishlist_course
        foreign key (course_id)
        references course(id)
);


create table notification (
 id uuid primary key,
 user_id uuid not null,
 title varchar(200) not null,
 type varchar(50) not null,
 message text not null,
 read boolean not null default false,
 created_at timestamptz not null,

   constraint fk_notification_user foreign key (user_id)
       references users(id)
);



create table lecture (
 id uuid primary key,
 batch_id uuid not null,
 lecture_order int not null check (lecture_order > 0),
 title varchar(200) not null,
 published boolean not null,

constraint uq_batch_lecture_order unique (batch_id, lecture_order),

constraint fk_lecture_batch foreign key (batch_id)
	references course_batch(id)
);



create table coupon (
    id uuid primary key,
    code varchar(50) not null unique,
    discount_type varchar(20) not null check (discount_type in ('percentage', 'fixed_amount')),
    percentage numeric(5,2) check (percentage >= 0 and percentage <= 100),
    fixed_amount numeric(10,2) check (fixed_amount >= 0),
    start_date timestamptz not null,
    end_date timestamptz not null,
    active boolean not null,

	
    constraint chk_coupon_date check (end_date > start_date),

    constraint chk_coupon_discount
	check (
		(discount_type = 'percentage' and percentage is not null and fixed_amount is null)
		or
		(discount_type = 'fixed' and fixed_amount is not null and percentage is null)
	)
);






create table Enrollment(
     user_id uuid not null,
	 batch_id uuid not null,

	 status varchar(50) not null,
	 amountPaid numeric(12,5) not null default 0,
	 paymentStatus varchar(50) not null,
	 deliveryMode varchar(50) not null,
	 coupon_id uuid,
	 meetingLink varchar(1000),
	 enrolledAt timestamptz not null default now(),
	 
	 primary key(user_id,batch_id),
	 
	 constraint fk_enrollment_user
	 foreign key(user_id)
	 references users(id),

	 constraint fk_enrollment_batch
	 foreign key(batch_id)
	 references course_batch(id),

	 constraint fk_enrollment_coupon
	 foreign key(coupon_id)
	 references coupon(id)
	 
	 
);

create table Attendance(
      lecture_id uuid not null,
	  student_id uuid not null,
	  status varchar(50) not null
	         CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),

	   PRIMARY KEY (lecture_id, student_id),

	    CONSTRAINT fk_attendance_lecture
        FOREIGN KEY (lecture_id)
        REFERENCES lecture(id),

    CONSTRAINT fk_attendance_student
        FOREIGN KEY (student_id)
        REFERENCES users(id)
);

create table Certificate(
     student_id uuid not null,
	 batch_id   uuid not null,
	 
	 certificateUrl varchar(1000) not null,
	 issuedAt   timestamptz not null default now(),

	 PRIMARY KEY (student_id,batch_id),

	 CONSTRAINT fk_certificate_student
	      FOREIGN KEY (student_id)
		  references users(id),

     CONSTRAINT fk_certificate_batch
	      FOREIGN KEY (batch_id)
		  references course_batch(id)
);

create table Task(
      id   uuid PRIMARY KEY,
	  batch_id  uuid not null,
	  Title     varchar(500) not null,
	  dueDate   TIMESTAMPTZ NOT NULL, 
	  published TIMESTAMPTZ NOT NULL,
	  description  TEXT not null,

	  CONSTRAINT fk_task_batch
        FOREIGN KEY (batch_id)
        REFERENCES course_batch(id)
);


create table TaskSubmission(
      student_id    uuid not null,
	  task_id       uuid not null,
	  
	  status        varchar(50)not null,
	  feedback      text,
	  grade         numeric(5,2),
	  submittedAt   timestamptz not null default now(),
	  
	  PRIMARY KEY (student_id, task_id),

	  CONSTRAINT fk_submission_student
        FOREIGN KEY (student_id)
        REFERENCES users(id),

      CONSTRAINT fk_submission_task
        FOREIGN KEY (task_id)
        REFERENCES task(id)
	   
);


create table ContactMessage(
       id uuid PRIMARY KEY,
	   name varchar(100) not null,
	   title varchar(300) not null,
	   type   varchar(100) not null
	     CHECK (type IN ('QUESTION', 'COMPLAINT', 'SUGGESTION', 'TECHNICAL')),
	   message text not null,
	   read     BOOLEAN NOT NULL DEFAULT FALSE,
	   createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


create table LectureResouruce(
       id uuid PRIMARY KEY,
	   
	   lecture_id uuid not null,
	   name       varchar(200) not null, 
	   fileUrl    varchar(1000) not null,
	   size       BIGINT not null,
	   type       varchar(100) not null, 
	   createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	   CONSTRAINT fk_resource_lecture
        FOREIGN KEY (lecture_id)
        REFERENCES lecture(id)
	 
);


create table TaskResource(
    id UUID PRIMARY KEY,

    task_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,

    fileUrl VARCHAR(1000) NOT NULL,

    size BIGINT NOT NULL,

    type VARCHAR(100) NOT NULL,

    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_task_resource_task
        FOREIGN KEY (task_id)
        REFERENCES task(id)
		
);


create table TaskSubmissionResource(
    id UUID PRIMARY KEY,

    student_id UUID NOT NULL,

    task_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,

    fileUrl VARCHAR(1000) NOT NULL,

    size BIGINT NOT NULL,

    type VARCHAR(100) NOT NULL,

    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_submission_resource
        FOREIGN KEY (student_id, task_id)
        REFERENCES TaskSubmission(student_id, task_id)
);

ALTER TABLE LectureResouruce RENAME TO lectureresource;

ALTER TABLE ContactMessage
DROP COLUMN read;

ALTER TABLE ContactMessage
ADD COLUMN email VARCHAR(255) NOT NULL;

ALTER TABLE ContactMessage
ADD COLUMN phone VARCHAR(20);

ALTER TABLE ContactMessage
DROP CONSTRAINT contactmessage_type_check;

ALTER TABLE ContactMessage
ADD CONSTRAINT contactmessage_type_check
CHECK (type IN (
    'GENERAL',
    'QUESTION',
    'COMPLAINT',
    'SUGGESTION',
    'TECHNICAL'
));


ALTER TABLE category
ADD COLUMN short_description VARCHAR(500) NOT NULL;


ALTER TABLE course
ADD COLUMN short_description VARCHAR(500) NOT NULL;

ALTER TABLE course
ADD COLUMN icon_url VARCHAR(500);


select * from users;

CREATE TABLE course_category (
    course_id UUID NOT NULL,
    category_id UUID NOT NULL,

    CONSTRAINT pk_course_category
        PRIMARY KEY (course_id, category_id),

    CONSTRAINT fk_course_category_course
        FOREIGN KEY (course_id)
        REFERENCES course(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_course_category_category
        FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE RESTRICT
);




ALTER TABLE course
DROP CONSTRAINT fk_course_category;


ALTER TABLE course
DROP COLUMN category_id;





INSERT INTO course_category (course_id, category_id)
VALUES
('4f7b3d39-a03d-4a96-8106-90ff4044d42e', '23e8f58a-724f-4a91-ba7c-982860b68d95'),
('e357a565-b55a-41fa-bd2a-e5974cef8632', 'd7cdd83f-6017-4f5a-a38f-9177d55819f0'),
('507a8f8a-a864-40df-9f61-4b3160d5edcb', '23e8f58a-724f-4a91-ba7c-982860b68d95'),
('507a8f8a-a864-40df-9f61-4b3160d5edcb', 'e42f537a-26a3-46a9-9885-d432057c67fc'),
('3156832d-99ad-452a-9d1b-ead993011f66', '23e8f58a-724f-4a91-ba7c-982860b68d95')
;

select * from course_category;


------------------------------------------ new --------------------------------------------------------------


UPDATE course
SET content_url = '/contents/pdfs/jbr-34-3-228.pdf';


UPDATE course
SET description = 'Learn Autodesk Revit Architecture from the ground up and develop the skills needed to create professional Building Information Modeling (BIM) projects. This comprehensive course takes you through the complete architectural workflow, starting with the Revit interface, project setup, levels, grids, and basic modeling concepts, then progressing into detailed architectural modeling and documentation.

You will learn how to create and manage walls, floors, roofs, doors, windows, stairs, ceilings, rooms, and other architectural elements while maintaining an organized and accurate BIM model. The course also covers views, sections, elevations, dimensions, annotations, schedules, sheets, and professional construction documentation.

Throughout the training, you will work with Revit families, project parameters, materials, and design components to create flexible and well-structured architectural models. You will also learn how to prepare professional drawings and documentation suitable for real-world architectural projects and industry standards.

By the end of the course, you will have a solid understanding of the Revit Architecture workflow and be able to develop complete architectural BIM models from the initial project setup through modeling, documentation, and final presentation.'
WHERE id = '4f7b3d39-a03d-4a96-8106-90ff4044d42e';




CREATE TABLE course_registrations (
    id UUID PRIMARY KEY,

    full_name VARCHAR(150) NOT NULL,

    phone VARCHAR(30) NOT NULL,

    email VARCHAR(150),

    message TEXT,

    course_id UUID NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'NEW',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_course_registration_course
        FOREIGN KEY (course_id)
        REFERENCES course(id)
        ON DELETE CASCADE
);



CREATE INDEX idx_course_registrations_course_id
ON course_registrations(course_id);

----------------------new----------------
ALTER TABLE course
    ADD COLUMN content_url VARCHAR(1000);

ALTER TABLE category
    ADD COLUMN published BOOLEAN NOT NULL DEFAULT FALSE;


----------------------new-----------------
ALTER TABLE category
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

------------------new---------------------
ALTER TABLE course
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-------------------- new -----------------
ALTER TABLE lectureresource
ADD COLUMN source VARCHAR(50) NOT NULL;

select * from lecture;

-----------------new 22/8/2026 ____________
INSERT INTO course_batch (
    id,
    course_id,
    instructor_id,
    name,
    status,
    attendance_type,
    capacity,
    start_date,
    end_date
)
VALUES (
           '33333333-3333-3333-3333-333333333333',
           '3156832d-99ad-452a-9d1b-ead993011f66',
           '89808211-2de4-437b-9849-61056c51ae9c',
           'Interior Design Diploma batch 1',
           'OPEN',
           'ONLINE',
           30,
           '2026-09-01 10:00:00+03',
           '2026-10-01 10:00:00+03'
       );


INSERT INTO Enrollment (
    user_id,
    batch_id,
    status,
    amountPaid,
    paymentStatus,
    deliveryMode,
    meetingLink
)
VALUES (
           '545dbb5a-78e1-4feb-be14-723dbddc7840',
           '33333333-3333-3333-3333-333333333333',
           'ACTIVE',
           1000,
           'PENDING',
           'ONLINE',
           'https://meet.google.com/example'
       );


INSERT INTO wishlist (
    user_id,
    course_id
)
VALUES (
           '545dbb5a-78e1-4feb-be14-723dbddc7840',
           '3156832d-99ad-452a-9d1b-ead993011f66'
       );


INSERT INTO Certificate (
    student_id,
    batch_id,
    certificateUrl
)
VALUES (
           '545dbb5a-78e1-4feb-be14-723dbddc7840',
           '33333333-3333-3333-3333-333333333333',
           'file:///C:/Users/pc/Desktop/new%20service/courses-management-system/backend/src/main/resources/static/images/courses/Certificates/arwa-revit-batch-1.pdf'
       );



INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    password,
    phone,
    role,
    enabled,
    created_at,
    updated_at
) VALUES (
             'a1111111-1111-1111-1111-111111111111',
             'Omar',
             'Hassan',
             'instructor@gmail.com',
             '$2a$10$21ZlRYEg61ML2Pnsctdm9uqvZ10oeF6Q5EGCSytmmP59sPyWO3Roa',
             '01012345678',
             'INSTRUCTOR',
             true,
             NOW(),
             NOW()
         )
    ON CONFLICT (email) DO NOTHING;

INSERT INTO course_batch (
    id,
    course_id,
    instructor_id,
    name,
    status,
    attendance_type,
    capacity,
    start_date,
    end_date
) VALUES
    (
        '22222222-2222-2222-2222-222222222222',
        '3156832d-99ad-452a-9d1b-ead993011f66',
        'a1111111-1111-1111-1111-111111111111',
        'Interior Design Diploma batch 2',
        'ACTIVE',
        'ONLINE',
        25,
        NOW(),
        NOW() + INTERVAL '60 days'
    )

UPDATE Certificate
SET certificateUrl = '/images/courses/Certificates/arwa-revit-batch-1.pdf'
WHERE student_id = '545dbb5a-78e1-4feb-be14-723dbddc7840'
  AND batch_id = '33333333-3333-3333-3333-333333333333';


select * from course
select * from users

--------------------new 26/8/2026------------------------
ALTER TABLE course_batch
    ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE ENROLLMENT
    ADD COLUMN removed BOOLEAN NOT NULL DEFAULT FALSE

--------------------new 28/8-----------------------------
ALTER TABLE course_batch ADD COLUMN batch_code VARCHAR(20) UNIQUE;
ALTER TABLE course_batch ADD COLUMN code_expires_at TIMESTAMP WITH TIME ZONE;

CREATE TABLE enrollment_requests (
                                     id UUID PRIMARY KEY,
                                     user_id UUID NOT NULL,
                                     batch_id UUID NOT NULL,
                                     status VARCHAR(50) NOT NULL,
                                     requested_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                     updated_at TIMESTAMP WITH TIME ZONE,
                                     FOREIGN KEY (user_id) REFERENCES users(id),
                                     FOREIGN KEY (batch_id) REFERENCES course_batch(id)
);


-----------------------------new 28/8-------------------------------------
ALTER TABLE users
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;


---------------------------new 4/9----------------------------------------
ALTER TABLE contactmessage
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE contactmessage
    ADD COLUMN is_contacted BOOLEAN NOT NULL DEFAULT FALSE;

--------------------------new 4/9 ------------------------------------------
ALTER TABLE contactmessage
DROP COLUMN title,
DROP COLUMN type;