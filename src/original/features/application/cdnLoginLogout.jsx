let { useSelector, useDispatch } = ReactRedux;
let { useState } = React;
let { Modal, Container, Row, Form, InputGroup, Button, Col, Image, FormControl } = ReactBootstrap;

import {
    selectApplication, set_user_profile, setUserProfile
} from "./cdnApplicationSlice";

//import Unsplash, { toJson } from "unsplash-js";


//https://unsplash.com/collections/aH98dheb50M/avatars

function SearchPhotos(props) {
    const [query, setQuery] = useState("");
    const [pics, setPics] = useState([]);

    const unsplash = basicfirebasecrudservices.createApi({ accessKey: "NhcRJz0lTzcxiZusH5ss4Up8-hBz5DTED3UE8rLCjbo" });

    // const unsplash = new Unsplash({ accessKey: "NhcRJz0lTzcxiZusH5ss4Up8-hBz5DTED3UE8rLCjbo" });

    const searchPhotos = async () => {
        //   e.preventDefault();
        unsplash.collections.getPhotos({ collectionId: 'aH98dheb50M' })
            // unsplash.search
            //     .photos(query, randomInt(1, 20), 18)
            //     .then(toJson)
            // .then((json) => {
            //     setPics(json.results);
            // });
            .then((res) => {
                //  console.log(res)
                setPics(res.response.results);
            });
    };

    ;

    return <>
        <InputGroup className="mb-3">

            <InputGroup.Text id="query">{pics.length > 0 ? 'Щелкните на картинке для выбора' : ' '} 📷</InputGroup.Text>

            <FormControl
                aria-label="query"
                aria-describedby="query"
                type="text"
                //      name="query"
                placeholder={`Try "face", "smile" or "happy face"`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <Button variant="outline-secondary" onClick={() => searchPhotos()} size="sm">{pics.length > 0 ? 'Искать снова' : 'Искать аватар'}</Button>

        </InputGroup>


        <Container>
            <Row>
                {pics.map((pic) =>
                    <Col xs={6} md={2} key={pic.id}>
                        <Image
                            alt={pic.alt_description}
                            src={pic.urls.thumb}
                            thumbnail
                            onClick={() => props.setUnsplashPic(pic.urls.thumb)} />
                    </Col>
                )}
            </Row>
        </Container>
    </>
}

function UserFrofile(props) {
    return <div>
        <img
            src={props.avatarUrl}
            alt={props.user}
            className="m-3"
            style={{
                verticalAlign: "middle",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                filter: "grayscale(100%)",
                objectFit: "cover",
            }}
        />
        <div>
            <h5>{props.user}</h5>
            <p>{props.email}</p>
        </div>
    </div>
}

function LoginLogout({ screenSize = "large" }) {
    const user_profile = useSelector(selectApplication);
    const [unsplashPic, setUnsplashPic] = useState(null);
    const dispatch = useDispatch();
  //  const [modalShow, setModalShow] = useState(false);

    // const applicationSelector = useContext(ApplicationContext);
     const [show, setShow] = useState(false);

    let user = user_profile.user?.user;
    let email = user_profile.user?.email;



    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(e.currentTarget.elements.formEmail.value);
        console.log(e.currentTarget.elements.formUser.value);


        dispatch(setUserProfile(
            {
                email: e.currentTarget.elements.formEmail.value,
                user: e.currentTarget.elements.formUser.value,
                avatarUrl: "../freelancer.jpg",
            }));
        setTimeout(function () { setShow(false) }, 1000);
        setUnsplashPic(null)


        // basicfirebasecrudservices.saveState({
        //     application: {
        //         email: e.currentTarget.elements.formEmail.value,
        //         user: e.currentTarget.elements.formUser.value,
        //         avatarUrl: "../freelancer.jpg",
        //         userEmail: e.currentTarget.elements.formEmail.value.replace(
        //             /[^a-zA-Z0-9]/g, "_")
        //     }
        // });


        setTimeout(() => window.location.reload(), 3000)

    };



    return (
        <>
            <span onClick={() => handleShow()} style={{ marginRight: "1rem" }}>
                {!!user_profile?.user && user_profile.user.length > 0 ? user_profile.user : 'Anonymous'}
            </span>
{/* 
             <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>  */}

            <Modal
                size="lg"
                aria-labelledby="login"
                show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Пользователь</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {!!unsplashPic || (user_profile?.avatarUrl && user_profile.avatarUrl.length > 10) ?
                        <UserFrofile email={user_profile.email}
                            user={user_profile.user}
                            avatarUrl={!!unsplashPic ? unsplashPic : user_profile.avatarUrl} />
                        : null}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email"
                                placeholder={email}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUser">
                            <Form.Label>User</Form.Label>
                            <Form.Control type="text"
                                placeholder={user}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                    <SearchPhotos setUnsplashPic={setUnsplashPic} />
                </Modal.Body>

            </Modal>
        </>
    );
}

export default LoginLogout

// function LoginLogout({ screenSize = "large" }) {
//     const user_profile = useSelector(selectApplication);
//     const [unsplashPic, setUnsplashPic] = useState(null);
//     const dispatch = useDispatch();
//     const [modalShow, setModalShow] = useState(false);

//     function onSubmit(data) {
//         //    console.log(data);
//         dispatch(setUserProfile(
//             {
//                 email: data.email,
//                 user: data.user,
//                 avatarUrl: data.avatarUrl
//             }));
//         setTimeout(function () { setModalShow(false) }, 1000);
//         setUnsplashPic(null)
//     }

//     return <>
//         <span onClick={() => setModalShow(true)} style={{ marginRight: "1rem" }}>
//             {!!user_profile?.user && user_profile.user.length > 0 ? user_profile.user : 'Anonymous'}
//         </span>
//         <Modal
//             size="lg"
//             show={modalShow}
//             onHide={() => setModalShow(false)}
//             aria-labelledby="login"
//         >
//             <Modal.Header closeButton>
//                 {screenSize === "large" ? <Modal.Title id="login-lg">Логин</Modal.Title> : <small>Логин</small>}

//             </Modal.Header>
//             <Modal.Body>
//                 {!!unsplashPic || (user_profile?.avatarUrl && user_profile.avatarUrl.length > 10) ?
//                     <UserFrofile email={user_profile.email}
//                         user={user_profile.user}
//                         avatarUrl={!!unsplashPic ? unsplashPic : user_profile.avatarUrl} />
//                     : null}
//                 <UserFormHook
//                     email={user_profile.email}
//                     user={user_profile.user}
//                     avatarUrl={!!unsplashPic ? unsplashPic : user_profile.avatarUrl}
//                     unsplashPic={unsplashPic}
//                     onSubmit={onSubmit}
//                     screenSize={screenSize}
//                 />
//                 <SearchPhotos setUnsplashPic={setUnsplashPic} />
//             </Modal.Body>
//         </Modal>
//     </>
// }

// let modalForm = [
//     { name: "email", title: "Email", type: "email" },
//     { name: "user", title: "ФИО Группа", type: "text" },
//     { name: "avatarUrl", title: "URL аватар", type: "url" }
// ];

// function UserFormHook(props) {
//     const { register, handleSubmit, setValue } = useForm({ // reset, watch, errors
//         defaultValues:
//         {
//             email: props.email,
//             user: props.user,
//             avatarUrl: props.avatarUrl
//         }
//     });

//     useEffect(() => {
//         setValue('avatarUrl', props.unsplashPic);
//         // reset({
//         //     email: props.email,
//         //     user: props.user,
//         //     avatarUrl: props.avatarUrl
//         // });
//     }, [props.unsplashPic]);

//     return <form onSubmit={handleSubmit(props.onSubmit)}>
//         {modalForm.map(item =>
//             <InputGroup className="mb-3" size="sm" key={item.name}>

//                 <InputGroup.Text style={{ width: '6rem' }}>
//                     {props.screenSize === "large" ? item.title : <small>{item.title}</small>}
//                 </InputGroup.Text>
//                 <FormControl
//                     key={item.name}
//                     //           name={item.name}
//                     type={item.type}
//                     {...register(item.name)}
//                 //    ref={register}
//                 />
//             </InputGroup>
//         )}
//         <Button variant="outline-secondary" type="submit" size="sm">Сохранить</Button>
//     </form>
// }

// function randomInt(min, max) {
//     return min + Math.floor((max - min) * Math.random());
// }

