const {nanoid} = require("nanoid");
const {rooms}=require("../store/roomStore");
const createRoomController=(req,res)=>{
  try{
    const roomId=nanoid(10);
    rooms.set(roomId, {

            roomId,

            hostId: req.user.id,

            participants: [],

            language: "cpp",

            code: `#include <iostream>

        using namespace std;

        int main() {

            cout << "Welcome to CodeSync!";

            return 0;

        }`,

            createdAt: new Date()

        });
    console.log(rooms);
    res.status(200).json(
      {message:"Room created successfully", roomId}
    );
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json(
      {message:"Internal server error"}
    );
  }
}
module.exports=createRoomController;