import { useState, useEffect } from "react";
//import firebase from "gatsby-plugin-firebase";

export function useFirebaseNode(url, options) {
    const [status, setStatus] = useState({
        loading: false,
        data: undefined,
        error: undefined
    });

    function fetchNow(url, options) {
        setStatus({ loading: true });

        basicfirebasecrudservices.getFirebaseNode({
            url, type: "object"
        })
            // firebase
            //   .database()
            //   .ref(url)
            //   .once("value")
            //   .then(snapshot => {
            //     setStatus({ loading: false, data: snapshot.val() });
            //   })
            .then(res => {
                setStatus({ loading: false, data: res })
            })
            .catch((error) => {
                setStatus({ loading: false, error });
            });
    }

    useEffect(() => {
        if (url) {
            fetchNow(url, options);
        }
    }, []);

    return { ...status, fetchNow };
}