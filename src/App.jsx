import './App.css'
import { useEffect, useState } from 'react'
import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material'
import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXaTk-Z5mCjAQ_xEFp0WPkMWTksB-ON00",
  authDomain: "sunkenrats-3859e.firebaseapp.com",
  projectId: "sunkenrats-3859e",
  storageBucket: "sunkenrats-3859e.firebasestorage.app",
  messagingSenderId: "481792890187",
  appId: "1:481792890187:web:315726d0978b97a30584ce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function App() {

  const [user, setUser] = useState({});
  const [ data, setData ] = useState([]);
  const [ id, setId ] = useState("");
  const [ xbox, setXbox ] = useState("");
  const [ discord, setDiscord ] = useState("");
  const [ form, setForm ] = useState("");
  const [ lookup, setLookup ] = useState("");
  const [ guildStatus, setGuildStatus ] = useState("Joined");
  const [ discordStatus, setDiscordStatus ] = useState("Joined");

  async function upload() {
    await addDoc(collection(db, "guild_members"), {discord:discord, xbox:xbox, form:form, lookup:lookup, discordStatus:discordStatus, guildStatus:guildStatus});
  }

  async function fillFields(id) {
    if (user && user.email == "hunorgaming000@gmail.com") {
      const snap = await getDoc(doc(db, "guild_members", id));
      if (snap.exists()) {
        setId(id);
        setXbox(snap.data().xbox);
        setDiscord(snap.data().discord);
        setForm(snap.data().form);
        setLookup(snap.data().lookup);
        setGuildStatus(snap.data().guildStatus);
        setDiscordStatus(snap.data().discordStatus);
      }
    }
  }

  async function leftGuild(id) {
    if (user && user.email == "hunorgaming000@gmail.com") {
      const snap = await getDoc(doc(db, "guild_members", id));
      if (snap.exists()) {
        setId(id);
        setXbox(snap.data().xbox);
        setDiscord(snap.data().discord);
        setForm(snap.data().form);
        setLookup(snap.data().lookup);
        setGuildStatus(snap.data().guildStatus);
        setDiscordStatus(snap.data().discordStatus);
  
        await deleteDoc(doc(db, "guild_members", id));
      }
    }
  }

  function clearFields() {
    setId("");
    setXbox("");
    setDiscord("");
    setForm("");
    setLookup("");
    setGuildStatus("Joined");
    setDiscordStatus("Joined");
  }

  async function updatePlayer() {
    if (id != "") {
      await updateDoc(doc(db, "guild_members", id), {discord:discord, xbox:xbox, form:form, lookup:lookup, discordStatus:discordStatus, guildStatus:guildStatus});
    }
  }

  async function login() {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
    if (auth && user) {
      const unsub = onSnapshot(collection(db, 'guild_members'), (snap) => {
        setData(snap.docs.map(doc => ({ ...doc.data(), id:doc.id })));
      });
      return unsub;
    }
  },[auth, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  })

  return (
    <div>
      {auth && user && user.email == "hunorgaming000@gmail.com" ?
        <Stack gap={2} className='container'>
          <TextField id="outlined-basic" label="Document ID for updating" variant="outlined" value={id} onChange={e => setId(e.target.value)}/>
          <Divider />
          <TextField id="outlined-basic" label="Xbox Name" variant="outlined" value={xbox} onChange={e => setXbox(e.target.value)}/>
          <TextField id="outlined-basic" label="Discord Name" variant="outlined" value={discord} onChange={e => setDiscord(e.target.value)}/>
          <TextField id="outlined-basic" label="Form page" variant="outlined" value={form} onChange={e => setForm(e.target.value)}/>
          <TextField id="outlined-basic" label="Xbox lookup" variant="outlined" value={lookup} onChange={e => setLookup(e.target.value)}/>
          <FormControl>
            <FormLabel id="discordformgroup">Discord Status</FormLabel>
            <RadioGroup
              row
              aria-labelledby="discordformgroup"
              name="discordformgroup"
              value={discordStatus}
              onChange={e => setDiscordStatus(e.target.value)}
            >
              <FormControlLabel value="Joined" control={<Radio />} label="Joined" />
              <FormControlLabel value="Invited" control={<Radio />} label="Invited" />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel id="guildformgroup">Guild Status</FormLabel>
            <RadioGroup row aria-labelledby="guildformgroup" name="guildformgroup" value={guildStatus} onChange={e => setGuildStatus(e.target.value)}>
              <FormControlLabel value="Joined" control={<Radio />} label="Joined" />
              <FormControlLabel value="Invited" control={<Radio />} label="Invited" />
              <FormControlLabel value="Guild Leader" control={<Radio />} label="Guild Leader" />
            </RadioGroup>
          </FormControl>
          <Stack direction="row" sx={{"justifyContent" : "space-between"}}>
            <Stack direction="row" gap={2}>
              <Button sx={{"width" : "200px"}} variant="contained" onClick={upload} color='success'>Upload</Button>
              <Button sx={{"width" : "200px"}} variant="contained" onClick={updatePlayer} color='secondary'>Update</Button>
              <Button variant="contained" onClick={clearFields} color="error">Clear</Button>
              <span className='number'>{data.length+1} / 24</span>
            </Stack>
            <Stack direction="row" gap={2}>
              <Button sx={{"width" : "200px"}} variant="outlined" onClick={logout} color='secondary'>Log Out</Button>
            </Stack>
        </Stack>
      </Stack>
      : auth && user ?
        <Stack gap={2} className='container'>
          <Button sx={{"width" : "200px"}} variant="outlined" onClick={logout} color='secondary'>Log Out</Button>
          <span className='number'>{data.length+1} / 24</span>
        </Stack>
      : ""
      }
      {auth && user ? 
        <div className='container'>
          <table>
            <thead>
              <tr id="header">
                <th>Xbox name</th>
                <th>Discord name</th>
                <th>Form page</th>
                <th>Availability</th>
                <th>Discord</th>
                <th>Guild</th>
                <th className='left'>Left Guild</th>
                <th>Copy</th>
              </tr>
            </thead>
            <tbody>
              <tr id="header">
                <td className='leader'>hunor000</td>
                <td className='leader'>hunor.exe</td>
                <td className='leader'>-</td>
                <td className='leader'>-</td>
                <td className='leader'>Guild Owner</td>
                <td className='leader'>Guild Owner</td>
                <td className='leader'></td>
                <td className='leader'></td>
              </tr>
              {data.map(x => (
                <tr key={x.id} >
                  <td>{x.xbox}</td>
                  <td>{x.discord}</td>
                  <td className='copy'>{x.form != "-" ? <a target="_blank" href={x.form}>Form Page</a> : "-" }</td>
                  <td className='copy'>{x.lookup.includes("https://xboxgamertag.com/search/") ? <a target="_blank" href={x.lookup}>Activity Lookup</a> : "-" }</td>
                  <td className={x.discordStatus == "Joined" ? "joined" : "invited"}>{x.discordStatus}</td>
                  <td className={x.guildStatus == "Joined" ? "joined" : x.guildStatus == "Guild Leader" ? "leader" : "invited"}>{x.guildStatus}</td>
                  <td><img className='delete' src="exit.png" alt="X" onClick={() => leftGuild(x.id)}/></td>
                  <td onClick={() => fillFields(x.id)} className='copy'></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      : <div className='container'>
          <img src="google.png" onClick={login} className='center'/>
        </div>}
    </div>
  )
}

export default App
