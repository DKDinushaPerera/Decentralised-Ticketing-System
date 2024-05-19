import React, { useEffect, useState } from 'react';
import './Mainpage.css';
import axios from "axios";
import Popup from 'reactjs-popup';
import idGenerator from '../../contracts/idGenerator.json';
import Web3 from 'web3';
import emailjs from 'emailjs-com';

const Mainpage = () => {
  const [myData, setMyData] = useState([]);
  const [isError, setIsError] = useState("");
  const [imageSrc, setImageSrc] = useState([]);
  const [value2, setValue2] = useState("");
  const [index, setIndex] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [idd, setId] = useState(null);
  const [update, setUpdate] = useState(null);
  const [state, setState] = useState({ web3: null, contract: null, accounts: [] });

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    provider && initializeWeb3();

    async function initializeWeb3() {
      try {
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = idGenerator.networks[networkId];
        const contract = new web3.eth.Contract(idGenerator.abi, deployedNetwork.address);
        const accounts = await web3.eth.getAccounts();
        
        console.log('Web3:', web3);
        console.log('Contract:', contract);
        console.log('Accounts:', accounts);
        
        setState({ web3: web3, contract: contract, accounts: accounts });
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    if (e.target.id === 'textInput1') {
      console.log("Input value:", e.target.value);
      setValue2(e.target.value);
    }
  }

  useEffect(() => {
    if (idd && value2) {
      const pass = { id: idd, email: value2 };
      console.log('pass:', pass);

      emailjs.send('service_xj5reqo', 'template_0g7jzcs', pass, '2Hth3d79h_npMw0rj')
        .then((response) => {
          console.log('Email sent successfully:', response);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });
    }
  }, [idd, value2]);

  useEffect(() => {
    console.log('Variable 2:', value2);
  }, [value2]);

  useEffect(() => {
    console.log('Index:', selectedItemIndex);
  }, [selectedItemIndex]);

  const getMyPostData = async () => {
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setMyData(res.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  useEffect(() => {
    getMyPostData();
    const images = [];
    for (let i = 0; i < 15; i++) {
      images.push("https://picsum.photos/200/300?random=" + i);
    }
    setImageSrc(images);
  }, []);

  const images = imageSrc.map((image, index) => ({ url: image, index }));

  const getInputValue = (index) => {
    setIndex(index);
    console.log('Index:', index);
    _setID(index);
  };

  async function _setID(number) {
    const { contract, accounts } = state;
    if (!contract || !accounts.length) return;

    try {
      await contract.methods
        .setId(number)
        .send({ from: accounts[0] });

      setUpdate(number);
      console.log(`ID ${number} has been set.`);
    } catch (error) {
      console.error('Error setting ID:', error);
    }
  }

  useEffect(() => {
    const { contract } = state;

    async function result() {
      if (!contract) return;

      try {
        const data = await contract.methods.id().call();
        console.log('Contract data:', data);
        setId(parseInt(data));
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    }

    result();
  }, [update, state]);

  return (
    <div>
      <div className="background">
        <div className='cards'>
          <div className="grid">
            {images.map(({ url, index }) => {
              const post = myData[index];
              if (!post) return null;
              const { title, body } = post;
              return (
                <div key={index} className="card">
                  <img className='imageedit' src={url} alt="Random" width="250" height="250" />
                  <h2 className='tile'>{title.slice(0, 15).toUpperCase()}</h2>
                  <p className='bodyu'>{body.slice(0, 100)}</p>
                  <Popup trigger={<button id="myButton" className='button-54'>BOOK NOW</button>} modal nested>
                    {close => (
                      <div className='modal'>
                        <div className='content'>
                          <img className='imageedit' src={url} alt="Random" width="250" height="250" />
                          <p className='textEditor'>GREAT CHOICE!.</p>
                          <p className='textEditor'><b>{title.slice(0, 15).toUpperCase()}</b> ITS ONE OF OUR BEST EVENTS.</p>
                          <input id="textInput1" type="text" className='gmailInput' placeholder='ENTER THE GMAIL' onChange={handleInputChange} required></input>
                        </div>
                        <div>
                          <Popup
                            trigger={<button onClick={() => getInputValue(index)} id="ConfirmButton" className='button-54'>CONFIRM</button>}
                            modal nested
                            onOpen={() => getInputValue(index)}
                          >
                            {close => (
                              <div id="modal2" className='modal'>
                                <div className='content'>
                                  <p className='text2'>YOUR TICKET HAS BEEN BOOKED.</p>
                                  <p className='text2'>THE TICKET DETAILS WIL BE SEND TO YOUR E-MAIL.</p>
                                </div>
                                <div>
                                  <button id="button2" className='button-54' onClick={close}>THANK YOU</button>
                                </div>
                              </div>
                            )}
                          </Popup>
                          <button id='closeButton' className='button-54' onClick={close}>Close</button>
                        </div>
                      </div>
                    )}
                  </Popup>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
