import user from "../model/user.model.js";
import todo from "../model/todo.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function Signup(req, res) {
  try {
    const { UserName, email, password } = req.body;

    const finduser = await user.findOne({ UserName: UserName });

    if (finduser) {
      return res.status(505).send({ error: "UserName in use " });
    }

    const findemail = await user.findOne({ email: email });

    if (findemail) {
      return res.status(505).send({ error: "Email in use " });
    }

    const data = {
      UserName: UserName,
      email: email,
      password: password,
    };

    const newuser = new user(data);

    await newuser
      .save()
      .then(() => {
        return res.status(201).send({ msg: "user saved Successfuly " });
      })
      .catch((e) => {
        return res.send(505).send({ error: "Failed to save user" });
      });
  } catch (e) {
    return res.status(501).send({ error: e });
  }
}

export async function additem(req, res) {
  try {
    const { task, level, rate } = req.body;

    const item = {
      task: task,
      level: level,
      rate: rate,
    };

    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const email = decode.email;

    const newitem = new todo(item);

    await newitem
      .save()
      .then(async () => {
        const a = await user.findOne({ email: email });

        if (!user) {
          return res.status(501).send({ error: "user not found " });
        }

        a.list.push(newitem.id);

        a.save()
          .then(() => {
            return res
              .status(201)
              .send({ msg: "item saved in uers list successfuly " });
          })
          .catch((e) => {
            return res
              .status(501)
              .send({ error: "faild to save in userList  " });
          });
      })
      .catch((e) => {
        return res.status(501).send({ error: "faild to Save item " + e });
      });
  } catch (error) {
    return res.status(501).send({ error: "faild to add in list " + error });
  }
}

export async function Login(req, res) {
  try {
    const { UserName, password } = req.body;

    const data = await user.findOne({ UserName });

    if (!data) {
      return res.status(400).send({ error: "user Not Found !" });
    }

    bcrypt.compare(password, data.password, (err, isMatch) => {
      if (err) {
        return res.status(501).send({ error: "unable to match password " });
      }

      if (isMatch) {
        const token = jwt.sign({ email: data.email }, "secret123");

        return res.status(201).send({ user: token });
      } else {
        return res.status(400).send({ error: "Password Don't Match " });
      }
    });
  } catch (error) {
    return res.status(501).send({ error: "Failed To Login" + error });
  }
}

export async function SendUserData(req, res) {
  try {
    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const email = decode.email;

    const a = await user.findOne({ email: email });
    if (!a) {
      return res.status(501).send({ error: "User not found " });
    }

    const itemList = [];

    for (const itemId of a.list) {
      const item = await todo.findById(itemId);

      if (item) {
        itemList.push({
          index: itemId,
          task: item.task,
          level: item.level,
          rate: item.rate,
        });
      }
    }

    return res.status(201).send({ UserName: a.UserName, list: itemList });
  } catch (error) {
    return res.status(501).send({ error: "faild to get data " });
  }
}

export async function deleteCard(req, res) {
  try {
    const token = req.headers["x-access-token"];
    const decode = await jwt.verify(token, "secret123");
    const email = decode.email;

    const a = await user.findOne({ email: email });
    if (!a) {
      return res.status(501).send({ error: "User not found " });
    }

    const { id } = req.body;
     
    const cardIndex = a.list.findIndex( (card) => card._id.toString() === id)
    a.list.splice(cardIndex, 1);
    a.save();

    await todo.findByIdAndDelete(id);
    


  } catch (error) {
    return res.status(501).send({ error: "Faild to delete "+error });
  }
}

export async function changerating(req,res){
 
     try{ 

      const { id , rate} = req.body;
      

      const a = await todo.findById(id);
      a.rate = rate ;
      
      a.save();

      return res.status(201).send({msg:"Changed rating successfuly "});

     }catch(error){

            return res.status(501).send({error:"failed to change rate "+error});
     }    
}

export async function changelevel(req,res){

    try{

      const { id , level } = req.body;

      const a = await todo.findById(id);
      a.level = level;
      a.save();

      return res.status(201).send({msg:"level updated "});

    }catch(error){
      return res.status(501).send({error:error});
    }
}