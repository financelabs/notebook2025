import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createApi } from 'unsplash-js';

import { useForm } from "react-hook-form";

import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import Media from "react-bootstrap/Media";


import {
    selectApplication, set_user_profile
} from "./applicationSlice";


export default function LoginLogout({screenSize="large"}) {
    const user_profile = useSelector(selectApplication);
    const [unsplashPic, setUnsplashPic] = useState(null);
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);

    function onSubmit(data) {
    //    console.log(data);
        dispatch(set_user_profile(
            {
                email: data.email,
                user: data.user,
                avatarUrl: data.avatarUrl
            }));
        setTimeout(function () { setModalShow(false) }, 1000);
        setUnsplashPic(null)
    }

   return <>
        <span onClick={() => setModalShow(true)} style={{ marginRight: "1rem" }}>
            {!!user_profile?.user && user_profile.user.length > 0 ? user_profile.user : 'Anonymous'}
        </span>
        <Modal
            size="lg"
            show={modalShow}
            onHide={() => setModalShow(false)}
            aria-labelledby="login"
        >
            <Modal.Header closeButton>
                {screenSize === "large" ?  <Modal.Title id="login-lg">Логин</Modal.Title> : <small>Логин</small>}
               
            </Modal.Header>
            <Modal.Body>
                {!!unsplashPic || (user_profile?.avatarUrl && user_profile.avatarUrl.length > 10) ?
                    <UserFrofile email={user_profile.email}
                        user={user_profile.user}
                        avatarUrl={!!unsplashPic ? unsplashPic : user_profile.avatarUrl} />
                    : null}


                <UserFormHook
                    email={user_profile.email}
                    user={user_profile.user}
                    avatarUrl={!!unsplashPic ? unsplashPic : user_profile.avatarUrl}
                    unsplashPic={unsplashPic}
                    onSubmit={onSubmit}
                    screenSize={screenSize}
                />

                {/* <UniFormLayout schema={schema} setFormObject={setFormObject} model={form_user_profile} /> */}

                <SearchPhotos setUnsplashPic={setUnsplashPic} />

            </Modal.Body>
        </Modal>
    </>
}

let modalForm = [
    { name: "email", title: "Email", type: "email" },
    { name: "user", title: "ФИО Группа", type: "text" },
    { name: "avatarUrl", title: "URL аватар", type: "url" }
];

function UserFormHook(props) {
    const { register, handleSubmit, setValue } = useForm({ // reset, watch, errors
        defaultValues:
        {
            email: props.email,
            user: props.user,
            avatarUrl: props.avatarUrl
        }
    });

    useEffect(() => {
        setValue('avatarUrl', props.unsplashPic);
        // reset({
        //     email: props.email,
        //     user: props.user,
        //     avatarUrl: props.avatarUrl
        // });
    }, [props.unsplashPic]);

    return <form onSubmit={handleSubmit(props.onSubmit)}>
        {modalForm.map(item =>
            <InputGroup className="mb-3" size="sm" key={item.name}>
                <InputGroup.Prepend>
                <InputGroup.Text style={{ width: '6rem' }}>
                    {props.screenSize === "large" ? item.title : <small>{item.title}</small>}
                    </InputGroup.Text></InputGroup.Prepend>
                <FormControl
                    key={item.name}
         //           name={item.name}
                    type={item.type}
                    {...register(item.name)}
                //    ref={register}
                />
            </InputGroup>
        )}
        <Button variant="outline-secondary" type="submit" size="sm">Сохранить</Button>
    </form>
}

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function SearchPhotos(props) {
    const [query, setQuery] = useState("");
    const [pics, setPics] = useState([]);
    const unsplash = createApi({ accessKey: "NhcRJz0lTzcxiZusH5ss4Up8-hBz5DTED3UE8rLCjbo" });


    const searchPhotos = async () => {
        //   e.preventDefault();
        unsplash.search.getPhotos(
            {query, page: randomInt(1, 20), perPage: 18, orientation: 'portrait'})            
            .then((json) => {
                console.log(json);
                setPics(json.results);
            });
    };

    return <>
        <InputGroup className="mb-3">
            <InputGroup>
                <InputGroup.Text id="query">{pics.length > 0 ? 'Щелкните на картинке для выбора' : ' '} 📷</InputGroup.Text>
            </InputGroup>
            <FormControl
                aria-label="query"
                aria-describedby="query"
                type="text"
                //      name="query"
                placeholder={`Try "face", "smile" or "happy face"`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroup>
                <Button variant="outline-secondary" onClick={() => searchPhotos()} size="sm">{pics.length > 0 ? 'Искать снова' : 'Искать аватар'}</Button>
            </InputGroup>
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