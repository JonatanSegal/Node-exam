export function authorizedUser(socket, next){
    if(!socket.request.session || !socket.request.session.isLoggedIn){
        console.log("Bad request")
        next(new Error("No Euthorized"))
    }else{
        next()
    }
}