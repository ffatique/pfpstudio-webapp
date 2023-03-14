import Head from 'next/head'
import styles from '../styles/home.module.scss'
import { useState } from 'react'
import { useAddress, useNetwork, useStorage, useNetworkMismatch, ChainId, useContract, useContractRead, useSDK, ConnectWallet } from "@thirdweb-dev/react"
import { toast } from 'react-toastify'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/images/logo.png'
import { FaTwitterSquare, FaGithubSquare, FaCaretSquareRight, FaCheckSquare } from 'react-icons/fa'
import myABI from '../abi/myABI.json'

export default function Home(){
  const address = useAddress()
  const [, switchNetwork] = useNetwork()
  const isMismatched = useNetworkMismatch()
  const storage = useStorage()

  const [avatarUrl, setAvatarUrl] = useState(null)
  const [nameNFT, setNameNFT] = useState('')
  const [nameNFTFinal, setNameNFTFinal] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [minted, setMinted] = useState(false)
  const { contract } = useContract("0xaf967BdCBD7d70c49628e9071b2f456B86ff4c85")
  const totalSupply = useContractRead(contract, "totalSupply")
  const [box, setBox] = useState(false)

  const sdk = useSDK()
  const contract2 = sdk?.getContractFromAbi("0xaf967BdCBD7d70c49628e9071b2f456B86ff4c85", myABI.abi)
  
  var _uri = ""
  var _url = `https://opensea.io/assets/matic/0xaf967BdCBD7d70c49628e9071b2f456B86ff4c85/${parseInt(totalSupply.data?.toString())}`

  async function uploadJSON(e: any){
    e.preventDefault();
    setLoading(true)

    if(e.target.files[0]){

      const image = e.target.files[0];
      
      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        
        if(image.size > 4000000){
          toast.error('Image size exceeds 4mb')
          setLoading(false)
          return
        }

        const fileUri = await storage?.upload(image)
        .then(async(snapshot) =>{
          await storage?.download(`${snapshot}`)
          .then((uri: any) =>{
            setAvatarUrl(uri.url)
          })
        })
        toast.success('Image successfully uploaded to IPFS')
        setLoading(false)
        return
      }
      toast.error('Please upload a JPEG or PNG image')
      setLoading(false)
      return
    }
    toast.error('You have not uploaded any images')
    setLoading(false)
  }

  function saveName(){
    setSaved(true)
    setNameNFTFinal(nameNFT)
    setNameNFT('')
    setNameSaved(true)
  }

  async function mintNFT(){
    setLoading(true)
    
    const uri = await storage?.upload({ name: `#${totalSupply.data?.toString()} - ${nameNFTFinal}`,
    description: "PFPStudio Avatar",
    image: `${avatarUrl}`,
    },{rewriteFileNames: {fileStartNumber: 0}})
    .then((uri: any) =>{
      console.log('URI',uri.slice(7))
      _uri = `https://ipfs.io/ipfs/${uri.slice(7)}`
    })

     
    const data = (await contract2)?.call("mintTo", address, _uri)
    .then(function(myValue: any){
      const receipt = myValue.receipt
      toast.success('Your NFT has been minted successfully')
      setLoading(false)
      setMinted(true)
    })
    .catch(function(error: any){
      toast.error('Something Went Wrong Mining Your NFT')
      setLoading(false)
    })
  }

  function Close(){
    setBox(false)
  }

  function Open(){
    setBox(true)
  }
    
  return (
    <div className={styles.container}>
      <Head>
        <title>PFP STUDIO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta content="#37DBFF" name="theme-color"></meta>
      </Head>

      <main className={styles.pageContainer}>

        <div className={styles.headerContainer}>
          <Link href="/">
            <Image src={logo} alt="Logo PFP Studio" />
          </Link>
          <ConnectWallet accentColor="#37DBFF" btnTitle="Connect Your Wallet" className={styles.btn}/>
        </div>
        
        <div className={styles.mainContainer}>        
          <h1>Mint Your PFP</h1>
          <p>Network Polygon</p>
          
          {avatarUrl === null ?
            <label>
              { loading ? 
                <div className={styles.loading}>
                  <svg className={styles.spinner} width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                  </svg>
                </div>
                :
                <span>Upload your image (max 4mb)<i>recommendation 400x400</i></span>
              }
              <input type="file" accept='image/*' onChange={ uploadJSON }/>
            </label>
            :
            <>
              <div className={styles.avatar}>
                { nameSaved ?
                  <p>NFT: #{`${totalSupply.data?.toString()} - ${nameNFTFinal}`}</p>
                  :
                  <></>
                }         
                <Image src={avatarUrl} width={400} height={400} alt="NFT"/>
              </div >
              { saved ?
                <div className={styles.saved}>
                  <p>Upload Media IPFS</p>
                  <FaCheckSquare color="#02ff53" size={40}/>
                </div>
                :
                <></>
              }
              <div className={styles.name}>
                { saved ?
                  <>
                    { address ?
                      <>
                        { !isMismatched ?
                          <>
                            { minted ?
                              <div className={styles.minted}>
                                <div className={styles.saved}>
                                  <p>Minted</p>
                                  <FaCheckSquare color="#02ff53" size={40}/>
                                </div>
                                <div className={styles.saved}>
                                  <Link href={_url} >
                                    <p>Check on OpenSea</p>
                                  </Link>
                                </div>
                              </div>
                              :
                              <>
                              { loading ?
                                <button className={styles.tip2}>
                                  <div className={styles.loading}>
                                    <svg className={styles.spinner} width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                      <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                                    </svg>
                                  </div>  
                                </button>
                                :
                                <button className={styles.tip1} onClick={ mintNFT }>Mint Your NFT</button>
                              }
                              </>
                            }
                          </>
                          :
                          <div className={styles.btnContainer2}>
                            <button onClick={() => switchNetwork!(ChainId.Polygon)}>Switch Network</button>
                          </div>
                        }
                      </>
                      :
                      <div className={styles.btnContainer}>
                        <ConnectWallet accentColor="#37DBFF" btnTitle="Connect Your Wallet" className={styles.btn}/>
                      </div>
                    }
                  </>
                  :
                  <input type="text" placeholder="Name your NFT" value={(nameNFT)} onChange={(e) => setNameNFT(e.target.value)}/>
                }
                { nameNFT == '' ?
                  <></>
                  :
                  <>
                    <button onClick={ saveName }><FaCaretSquareRight color="black" size={40}/></button>
                  </>   
                }
              </div>
            </>
          }
        
        </div>

        { box ? 
          <div className={styles.boxContainer}>
            <h3>How Does It all Work?</h3>
            <p><b>PFP Studio</b> makes it easy to transform any image into an NFT in just <b>3 steps</b></p><br/>
            <p>We upload your image to <b>IPFS</b>, a decentralized file storage system, and mint it as an NFT in a shared collection of PFP NFTs on <b>Polygon</b></p>
            <button onClick={ Close }>Close</button>
          </div>
          :
          <></>
        }

        <div className={styles.footerContainer}>
          <div className={styles.left}>
            {avatarUrl === null ?
            <button onClick={ Open }><p>How does it work?</p></button>
            :
            <></>
            }
            <Link href="mailto:f_fatique@hotmail.com">
              <span>Feedback</span>
            </Link>
          </div>
          <div className={styles.right}>
            <Link href="https://twitter.com/f_fatique">
              <FaTwitterSquare color="black" size={20}/>
              <p>@f_fatique</p>
            </Link>           
            <Link href="https://github.com/ffatique/pfpstudio-webapp">
              <FaGithubSquare color="black" size={20}/>
              <p>GitHub</p>
            </Link>  
          </div>
          
        </div>
        
      </main>
    </div>
  )
}

