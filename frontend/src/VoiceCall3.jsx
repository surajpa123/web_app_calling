import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import axios from 'axios';  // To make API requests

function VoiceCall3() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [userData, setUserData] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  // Fetch users from the backend (phone numbers)
  useEffect(() => {
    axios.get('http://localhost:3000/api/users')
      .then(response => setUserData(response.data))
      .catch(error => console.error('Error fetching users', error));

    // Set up PeerJS instance
    const peer = new Peer();
    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({ audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  // Handle making a call to another user
  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
      const call = peerInstance.current.call(remotePeerId, mediaStream);
      
      // Log call to the backend
      const currentTime = new Date().toISOString();
      axios.post('http://localhost:3000/api/calls', {
        callerId: peerId,
        receiverId: remotePeerId,
        timestamp: currentTime,
        duration: 0,  // Duration will be updated after the call ends
      });

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  // Fetch call logs from the backend
  useEffect(() => {
    axios.get('http://localhost:3000/api/calls')
      .then(response => setCallLogs(response.data))
      .catch(error => console.error('Error fetching call logs', error));
  }, [peerId]);

  // Render users list and call logs
  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={e => setRemotePeerIdValue(e.target.value)}
        placeholder="Enter remote user ID"
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>

      <div>
        <h2>Users List</h2>
        <ul>
          {userData.map((user) => (
            <li key={user.peerId}>
              <button onClick={() => call(user.peerId)}>{user.phoneNumber}</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Call Logs</h2>
        <ul>
          {callLogs.map((log, index) => (
            <li key={index}>
              {log.timestamp} - Call with {log.receiverId} - Duration: {log.duration} seconds
            </li>
          ))}
        </ul>
      </div>

      <div>
        <video ref={currentUserVideoRef} />
      </div>
      <div>
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
}

export default VoiceCall3;
