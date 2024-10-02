const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			login: async (email, password) => {
				try {
					let response = await fetch(process.env.BACKEND_URL + "/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email,
							password: password
						})
					});
					
					if (response.ok) {
						let data = await response.json();
						sessionStorage.setItem("token", data.token); 
						return { success: true };
					} else if (response.status === 401) {
						return { success: false, message: "Unauthorized: Invalid credentials" };
					} else {
						console.log("unexpected error occurred on login", response.status);
						return { success: false, message: "Unexpected error occurred" };
					}
				} catch (error) {
					console.log("There was an error during login", error);
					return { success: false, message: "Network error occurred" };
				}
			},
			signUp: async(email, password) => {
				try{
					let response = await fetch(process.env.BACKEND_URL + "/api/signup",{
						method:"POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email, password: password
						})
					});
					const data = await response.json();
					console.log(data);
					return data;
				}catch(error){
					console.log("There was a error during sign up", error);
					throw error;	
				}
			},
			goPrivate: async() => {
				if(sessionStorage.getItem("token")) {
					try{
						let response = await fetch(process.env.BACKEND_URL + "/api/private", {
							headers: {Authorization: "Bearer " + sessionStorage.getItem("token")}
						}) 
						if (!response.ok) {return false}
						else{
							let data = await response.json()
							console.log(data)
							return true
						}
					}
					catch(error){
						console.log(error)
						return false
					}
				}
			}
		}
	};
};

export default getState;