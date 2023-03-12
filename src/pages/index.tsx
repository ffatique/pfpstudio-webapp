import Head from 'next/head'
import styles from '../styles/home.module.scss'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAddress, useNetwork, useStorage, useNetworkMismatch, ChainId } from "@thirdweb-dev/react"
import { toast } from 'react-toastify'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/images/logo.png'
import { ConnectWallet } from "@thirdweb-dev/react"
import { FaTwitterSquare, FaGithubSquare, FaCaretSquareRight, FaCheckSquare } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'


export default function Home(){
  const address = useAddress()
  const [, switchNetwork] = useNetwork()
  const isMismatched = useNetworkMismatch()
  const storage = useStorage()

  const [trackingLoading, setTrackingLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [nameNFT, setNameNFT] = useState('')
  const [nameNFTFinal, setNameNFTFinal] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  async function uploadImage(e: any){
    e.preventDefault();
    setLoading(true)

    if(e.target.files[0]){

      const image = e.target.files[0];
      
      if(image.type === 'image/jpeg' || image.type === 'imagem/png'){  

        const fileUri = await storage?.upload(image)
        .then(async(snapshot) =>{
          await storage?.download(`${snapshot}`)
          .then((uri: any) =>{
            setAvatarUrl(uri.url)
          })
        })
      }
    }
    setLoading(false)
  }

  function saveName(){
    setSaved(true)
    setNameNFTFinal(nameNFT)
    setNameNFT('')
    setNameSaved(true)
  }

  async function mintNFT(){
  
  }
    

  useEffect(() =>{

  }, [])

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
                <span>Upload your image (max 4mb)</span>
              }
              <input type="file" accept='image/*' onChange={ uploadImage }/>
            </label>
            :
            <>
              <div className={styles.avatar}>
                {nameSaved ?
                  <p>NFT: {nameNFTFinal}</p>
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
                          <button className={styles.tip1} onClick={ mintNFT }>Mint Your NFT</button>
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
                  <input type="text" placeholder="Name your NFT" value={nameNFT} onChange={ (e) => setNameNFT(e.target.value)}/>
                }
                { nameNFT === '' ?
                  <></>
                  :
                  <>
                    <button className="tip1" onClick={ saveName }><FaCaretSquareRight color="black" size={40}/></button>
                    <Tooltip anchorSelect=".tip1"  place='right' className={styles.tooltip}>
                      Next Step
                    </Tooltip>
                  </>
                }
              </div>
            </>
          }
        
        </div>

        <div className={styles.footerContainer}>        
          <Link href="https://twitter.com/f_fatique">
            <FaTwitterSquare color="black" size={20}/>
            <p>@f_fatique</p>
          </Link>           
          <Link href="/">
            <FaGithubSquare color="black" size={20}/>
            <p>GitHub</p>
          </Link>  
        </div>
        
      </main>
    </div>
  )
}

