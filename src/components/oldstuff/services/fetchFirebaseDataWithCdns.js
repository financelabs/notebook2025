import { useState, useEffect } from "react";
import getUser from "../../utlities/getUser";

const useFetch = ({ url, type }) => {
  const [email, setEmail] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        let response = await basicfirebasecrudservices.getFirebaseNode({ url, type });
        let user = await getUser();
        setEmail(user?.email);
        setUserEmail(user?.email.replace(/[^a-zA-Z0-9]/g,"_"));
        setUser(!!user?.user ? user.user : "John Doe");
        setAvatarUrl(!!user?.avatarUrl ? user.avatarUrl : 'https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop');
        setData(response);
        setError(null);
        setIsPending(false);       
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
        setIsPending(false);      }
    };
    fetchData();
  }, [url]);
  return { data, email, user, userEmail, avatarUrl, isPending, error };
};

export default useFetch