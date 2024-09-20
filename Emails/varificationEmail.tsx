import * as React from 'react';
// import { Html, Button } from "@react-email/components";

interface VerificationEmailProps{
    username: string;
    otp: string;
}
export function Email({username,otp}:VerificationEmailProps) {
//   const { url } = props;

  return (
    <div>
      ghello guys how are you
    </div>
  );
}

export default Email;
