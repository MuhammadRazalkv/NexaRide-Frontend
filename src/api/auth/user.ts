import axios from 'axios';
import axiosUserInstance from '../axios/axiosUserInstance';

//! sending email to backend to verify it 
export async function sendEmail(email: string) {
    const response = await axiosUserInstance.post('/verify-email', {
        email: email
    })
    return response
}

//! sending otp and email to backend for verification 
export async function sendOTP(otp: string) {
    try {
        const email = localStorage.getItem('email')
    if (!email) throw new Error("Email is missing")
    const response = await axiosUserInstance.post('/verify-otp', {
        email: email,
        otp: otp
    })
    return response.data
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server:", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

//! Re send OTP
export async function reSendOTP() {
    const email = localStorage.getItem('email')
    if (!email) throw new Error("Email is missing")
    const response = await axiosUserInstance.post('/resend-otp', {
        email: email
    })
    return response.data
}


//! Add info user 
export async function addInfo(name: string, phone: string, password: string, googleId: string, profilePic: string) {
    try {
        const email = localStorage.getItem('email')
        if (!email) throw new Error("Email is missing")
        const response = await axiosUserInstance.post('/addInfo', {
            name,
            email,
            googleId,
            profilePic,
            phone: parseInt(phone),
            password
        });

        return response.data
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server:", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

//! User login 

export async function login(email: string, password: string) {
    try {

        if (!email || !password) {
            throw new Error('Fields are missing')
        }
        const response = await axiosUserInstance.post('/login', {
            email,
            password
        })
        console.log(response.data);

        return response.data

    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in login :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

//! Login with google 
export async function loginWithGoogle({ email, googleId, name }: { email: string, googleId: string, name: string }) {
    try {

        if (!email) {
            throw new Error('Email is missing')
        } else if (!googleId) {
            throw new Error('Google Id  is missing')
        } else if (!name) {
            throw new Error('name is missing')
        }


        const response = await axiosUserInstance.post('/google-login', {
            email,
            googleId,
            name
        })
        console.log(response.data);

        return response.data

    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in login :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function forgotPass(email: string) {
    try {
        if (!email) {
            throw new Error('Email is required ')
        }
        const response = await axios.post('http://localhost:3000/user/requestPasswordReset', {
            email,
        })
        console.log(response.data);

        return response.data

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in login :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function resetPassword(id:string , token:string , password:string ) {
    try {
        if (!id || !token) {
            throw new Error('Credentials missing ')
        }
        const response = await axiosUserInstance.post('/resetPassword', {
            id,
            token,
            password
        })
        console.log(response.data);

        return response.data

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in login :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function getUserInfo() {
   
    try {
        const response = await axiosUserInstance.get('/getUserInfo')
        return response.data

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in get user info  :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}


export async function updateUserName(name:string) {
   
    try {
        const response = await axiosUserInstance.patch('/updateUserName',{name})
        return response.data

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in get user info  :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function updateUserPhone(phone:number) {
   
    try {
        const response = await axiosUserInstance.patch('/updateUserPhone',{phone})
        return response.data

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in get user info  :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function updateUserProfilePic(image:string) {
   
    try {
        const response = await axiosUserInstance.patch('/updateUserPic',{image})
        return response.data

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            console.log("Error message from server in update pfp  :", err.response.data.message);
            throw new Error(err.response.data.message);
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new Error(err.message);
        } else {
            console.log("Unknown error:", err);
            throw new Error("An unexpected error occurred");
        }
    }
}