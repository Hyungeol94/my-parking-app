import {useRef, useEffect, useState, createRef} from "react";
import { useShallow } from 'zustand/react/shallow';
import { useMyPageSlice, useAuthSlice, useThemeSlice, useImageSlice } from "../../../store";
import { useNavigate } from "react-router-dom";
import { UserDetailInfo, UserExtraInfo } from "../../../types/classImplementations"
import React from "react";
import MyProfileEditForm from "./MyProfileEditForm";


const MyProfileEdit = () => {
  const { myInfo, getMyInfo, setMyInfo, updateMyInfo } = useMyPageSlice(
    useShallow((state) => ({ 
      myInfo: state.myInfo, 
      getMyInfo: state.getMyInfo, 
      setMyInfo: state.setMyInfo, 
      updateMyInfo: state.updateMyInfo 
    }))
  )
  const { userBasicInfo } = useAuthSlice()
  const { _id : id } = userBasicInfo || {}
  const { uploadImage } = useImageSlice()
  const navigate = useNavigate()
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [imgFileView, setImgFileView]= useState('')
  const [userInputRef, setUserInputRef] = useState<{ [key in keyof UserBasicInfoType]: React.MutableRefObject<HTMLInputElement|null> }>({} as { [key in keyof UserBasicInfoType]: React.MutableRefObject<HTMLInputElement|null> })
  const [userExtraInputRef, setUserExtraInputRef] = useState<{ [key in keyof Required<ExtraType>]: React.MutableRefObject<HTMLInputElement|null> }>({} as { [key in keyof Required<ExtraType>]: React.MutableRefObject<HTMLInputElement|null> })
  const [isLoading, setIsLoading] = useState(false);
  const { isToastOpen, setIsToastOpen, alertText: toastMessage, setAlertText: setToastMessage, bgColor, setBgColor } = useThemeSlice(
    useShallow((state) => ({ 
      isToastOpen: state.isToastOpen, 
      setIsToastOpen: state.setIsToastOpen, 
      alertText: state.alertText, 
      setAlertText: state.setAlertText, 
      bgColor: state.bgColor, 
      setBgColor: state.setBgColor 
    }))
  )

  useEffect(function populateField () {
    (async () => {
      setIsLoading(true)
      const myInfo = await getMyInfo(id);
      setMyInfo(myInfo)

      const userExtraInfo: ExtraType = {...new UserExtraInfo(), ...myInfo.extra}
      const currentInfo: Partial<UserDetailInfo> = {...myInfo}
      delete currentInfo['extra']
      const userBasicInfo: UserBasicInfoType = {...currentInfo} as UserBasicInfoType
      //userInputRef object 생성
      setUserInputRef(
        Object.keys(userBasicInfo).reduce((acc, key) => {
        const myInputRef: React.MutableRefObject<HTMLInputElement|null> = createRef();
        acc[key as keyof UserBasicInfoType] = myInputRef;
        return acc;
        }, {} as { [key in keyof UserBasicInfoType]: React.MutableRefObject<HTMLInputElement|null> })
      )

      //userExtraInputRef object 생성
      setUserExtraInputRef(
        Object.keys(userExtraInfo).reduce((acc, key) => {
        const myInputRef: React.MutableRefObject<HTMLInputElement|null> = createRef();
        acc[key as keyof Required<ExtraType>] = myInputRef;
        return acc;
        }, {} as { [key in keyof Required<ExtraType>]: React.MutableRefObject<HTMLInputElement|null> })
      )
      setIsLoading(false)
    })();
  },[])

  
  const closeModal = () => {
    setModalIsOpen(false);
  };


  const boximgUpload = () => {
    if (imageUploadRef.current === null) return
    if (imageUploadRef.current.files === null) return
    setImgFileView(URL.createObjectURL(imageUploadRef.current.files[0]));
  };

    
  const handleImageUpload = async () => {
    if (imageUploadRef.current === null) return
    if (imageUploadRef.current.files === null ) return
    if (imageUploadRef.current.files.length === 0 ) return
    // setIsLoading(true)
    setIsToastOpen(true)
    setToastMessage("프로필 사진 변경을 요청하였습니다.")
    setBgColor("var(--toast-success)") 
    closeModal()
    
    const profileImageURL = await uploadImage(imageUploadRef)
    const updatedInfo = await updateMyInfo(id, {extra: {...myInfo.extra, profileImage: profileImageURL[0]}})
    setMyInfo({...myInfo, ...updatedInfo})
    
    setIsLoading(false)
    if (profileImageURL.length !== 0) {
      setIsToastOpen(true)
      setToastMessage("프로필 사진 변경이 완료되었습니다.")
      setBgColor("var(--toast-success)")
    }
  }


  const isString = (obj: string|undefined): obj is string => {
    if (obj === undefined)return false
    return true
  }


  const handleSubmit = async() => {
    //userInputRef object에 있는 데이터를 myBasicInfo에 모으기
    const myBasicInfo = {} as Omit<Partial<{[key in keyof UserBasicInfoType]: string}>, '_id'>
    Object.keys(userInputRef).forEach((key) => {
      if (key === '_id') return;
      const userInputValue = userInputRef[key as keyof UserBasicInfoType].current?.value;
      if (isString(userInputValue)) {
        myBasicInfo[key as keyof Omit<Partial<UserBasicInfoType>, '_id'>] = userInputValue;
    }})


    //userExtraInputRef object에 있는 데이터를 myExtraInfo에 모으기  
    const myExtraInfo = {} as Partial<{[key in keyof UserExtraInfo]: string}>
    Object.keys(userExtraInputRef).forEach((key) => {
      // if (key === 'profileImage') return;
      console.log('key:', key)
      const userInputValue = userExtraInputRef[key as keyof typeof userExtraInputRef]?.current?.value;
      if (isString(userInputValue)) {
        myExtraInfo[key as keyof Partial<UserExtraInfo>] = userInputValue;
      }
    });
    myExtraInfo['profileImage'] = myInfo.extra.profileImage
    console.log('myExtraInfo:', myExtraInfo)

    
    //editedInfo에 담아서 patch하기
    const editedInfo = {...myBasicInfo, extra: {...myExtraInfo}}
    console.log('editedInto:', editedInfo)
    if (await updateMyInfo(id, editedInfo)){
      setIsToastOpen(true)
      setToastMessage("프로필 수정이 완료되었습니다.")
      setBgColor("var(--toast-success)");
      navigate(`/mypage/${myInfo._id}`)
    }
  }

  
  return (
     <>
     <MyProfileEditForm
      myInfo = {myInfo}
      userInputRef = {userInputRef}
      userExtraInputRef = {userExtraInputRef}
      imageUploadRef = {imageUploadRef}
      handleImageUpload = {handleImageUpload}
      imgFileView = {imgFileView}
      boxImgUpload = {boximgUpload}
      modalIsOpen = {modalIsOpen}
      setModalIsOpen ={setModalIsOpen}
      closeModal ={closeModal}
      handleSubmit = {handleSubmit}
      isLoading ={isLoading}
      setIsLoading = {setIsLoading}
      isToastOpen = {isToastOpen}
      toastMessage = {toastMessage}
      bgColor = {bgColor}
     />
     </>
  )
  }

export default MyProfileEdit;
