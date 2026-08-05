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
