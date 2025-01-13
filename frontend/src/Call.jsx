import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VoiceCall = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false); // For receiving calls
  const [peerConnection, setPeerConnection] = useState(null);
  const localStreamRef = useRef(null); // To hold the local media stream
  const socket = useRef(null); // To store the socket connection

  useEffect(() => {
    // Connect to signaling server
    socket.current = io('http://localhost:5000');
    
    // Setup WebRTC connection
    const peerConn = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConn.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', event.candidate);
      }
    };

    peerConn.ontrack = (event) => {
      const [remoteStream] = event.streams;
      // Do something with the remote stream (e.g., render it in a video element)
    };

    setPeerConnection(peerConn);

    // Get local media stream (microphone)
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        stream.getTracks().forEach(track => peerConn.addTrack(track, stream));
      })
      .catch(error => console.error('Error accessing media devices:', error));

    // Listen for signaling messages from the server
    socket.current.on('offer', (offer) => {
      console.log('Incoming call from User A');
      // Show a UI to accept/reject the call
      setIsReceiving(true); // Show "answer call" option
      handleIncomingCall(offer);
    });

    socket.current.on('answer', (answer) => peerConn.setRemoteDescription(new RTCSessionDescription(answer)));
    socket.current.on('ice-candidate', (candidate) => peerConn.addIceCandidate(new RTCIceCandidate(candidate)));

  }, []);

  const handleIncomingCall = (offer) => {
    // Ensure 'offer' is an RTCSessionDescriptionInit object
    if (offer.type === 'offer') {
      // Set the remote description to the received offer
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => {
          // Create an SDP answer and send it back to User A
          peerConnection.createAnswer()
            .then(answer => peerConnection.setLocalDescription(answer))
            .then(() => {
              socket.current.emit('answer', peerConnection.localDescription);
              setIsReceiving(false); // Call answered
            });
        })
        .catch(err => {
          console.error('Error setting remote description:', err);
        });
    }
  };
  

  const handleRejectCall = () => {
    setIsReceiving(false); // Hide the "answer call" option and reject the call
  };

  const handleHangUp = () => {
    // Hang up the call and close the connection
    peerConnection.close();
    setIsCalling(false);
    setIsReceiving(false);
  };

  const makeCall = () => {
    setIsCalling(true);
  
    // Create an SDP offer and send it to the server
    peerConnection.createOffer()
    .then(offer => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      socket.current.emit('offer', peerConnection.localDescription);
    });
  
  };

  return (
    <div>
      <button onClick={makeCall} disabled={isCalling || isReceiving}>Make Call</button>
      
      {isReceiving && (
        <div>
          <button onClick={handleRejectCall}>Reject</button>
          <button onClick={handleIncomingCall}>Accept</button>
        </div>
      )}
      
      <button onClick={handleHangUp}>Hang Up</button>
      <audio ref={localStreamRef} autoPlay muted />
    </div>
  );
};

export default VoiceCall;
