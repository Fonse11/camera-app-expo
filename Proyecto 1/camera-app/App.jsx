import  { useState, useEffect } from 'react';
import * as React from 'react'
import { StyleSheet, Text, View,SafeAreaView,TouchableOpacity, Modal, Image} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import * as MediaLibrary from 'expo-media-library';


export default function App() {


const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = useState(null);

  const camRef = React.useRef(null);
  const [photo, setPhoto] = useState(null);
  const [open, setOpen] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

  useEffect( ()=> {
      (   async ()=> {
        const {status} = await Camera.requestCameraPermissionsAsync();
        requestPermission( status === 'granted');
        
      })();

      (   async ()=> {
        const MediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission( MediaLibraryPermission === 'granted');
        
      })();


      }, []);

  if(permission === null){
    return <View/>
  }
  else if(permission === false){
    return <Text>Acceso denegado</Text>
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture(){
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setPhoto(data.uri);
      setOpen(true);
    }
  }

  async function savePicture(){
    const asset = await MediaLibrary.createAssetAsync(photo)
    .then(()=>{
      alert("Fotografia guardada exitosamente!")
    })
    .catch(error=> {
      console.log("err", error);
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={{flex: 1, width: '100%' }}type={type} ref={camRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleCameraType}>
          <Ionicons name="camera-reverse-sharp" size={40} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnPhoto} onPress={()=>takePicture() }>
          <Ionicons name="camera" size={40} color="black" />
          </TouchableOpacity>

          {
            photo &&
            <Modal
              animationType='slide'
              transparent={false}
              visible={open}
            >
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin:10}}>
                <TouchableOpacity style={styles.buttonContainer} onPress={()=> setOpen(false)}>
                  <AntDesign name="close" size={40} color="red" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.btnPhoto} onPress={() => savePicture()}>
                  <Ionicons name="save" size={40} color="green" />
               </TouchableOpacity>

                <Image style={styles.photo}
                  source={{uri: photo}}/>
              </View>
             
            </Modal>
          }
      </Camera>
    </SafeAreaView>
  );

 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer:{
   position: 'absolute',
   bottom: 20,
   left:20,
   width:50,
   justifyContent:'center',
   alignItems:'center',
   borderRadius: 15,
   backgroundColor:'white',
  },
  btnPhoto:{
    position:'absolute',
    right: 20,
    bottom: 20,
    width:50,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  photo:{
    width:'100%',
    height: 350,
  }
});
