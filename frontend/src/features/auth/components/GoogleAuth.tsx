import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useGoogleLoginMutation } from "../hooks/useGoogleLoginMutation";

const GoogleAuth = ({ onLoginSuccess }) => {
  const googleLoginMutation = useGoogleLoginMutation(onLoginSuccess);
  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          googleLoginMutation.mutate(credentialResponse.credential);
        }}
        onError={() => {
          console.log("Błąd logowania");
        }}
      />
    </div>
  );
};
export default GoogleAuth;
