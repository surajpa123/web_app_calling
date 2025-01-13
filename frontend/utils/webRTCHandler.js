import store from "../src/store/store";
import {
  setLocalStream,
  setCallState,
  callStates,
  setCallingDialogVisible,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  resetCallDataState,
  setMessage,
} from "../src/store/actions/callActions";
const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE",
};

const defaultConstrains = {
  video: {
    width: 480,
    height: 360,
  },
  audio: true,
};

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

let connectedUserSocketId;
let peerConnection;
let dataChannel;

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
      createPeerConnection();
    })
    .catch((err) => {
      console.log(
        "error occured when trying to get an access to get local stream"
      );
      console.log(err);
    });
};

const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection(configuration);
  
    const localStream = store.getState().call.localStream;
  
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  
    peerConnection.ontrack = ({ streams: [stream] }) => {
      store.dispatch(setRemoteStream(stream));
    };
  
    // incoming data channel messages
    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;
  
      dataChannel.onopen = () => {
        console.log("peer connection is ready to receive data channel messages");
      };
  
      dataChannel.onmessage = (event) => {
        store.dispatch(setMessage(true, event.data));
      };
    };
  
    dataChannel = peerConnection.createDataChannel("chat");
  
    dataChannel.onopen = () => {
      console.log("chat data channel succesfully opened");
    };
  
    peerConnection.onicecandidate = (event) => {
      console.log("geeting candidates from stun server");
      if (event.candidate) {
        wss.sendWebRTCCandidate({
          candidate: event.candidate,
          connectedUserSocketId: connectedUserSocketId,
        });
      }
    };
  
    peerConnection.onconnectionstatechange = (event) => {
      if (peerConnection.connectionState === "connected") {
        console.log("succesfully connected with other peer");
      }
    };
  };
  