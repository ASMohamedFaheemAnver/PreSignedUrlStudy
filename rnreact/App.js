import axios from 'axios';
import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const App = () => {
  const BASE_URL = 'http://192.168.8.110:8080/';

  const onImagePick = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      async data => {
        const asset = data.assets?.[0];
        const file = {
          uri: asset?.uri,
          type: asset?.type,
          name: asset?.fileName,
        };
        try {
          const res = await axios.post(BASE_URL, {filePath: file.name});
          console.log({data: res.data});
          const preSignedFormData = new FormData();
          preSignedFormData.append('Content-Type', file.type);
          Object.keys(res.data.fields).forEach(key => {
            preSignedFormData.append(key, res.data.fields[key]);
          });
          preSignedFormData.append('file', file);
          const s3Res = await axios.post(res.data.url, preSignedFormData);
          console.log({s3Res});
        } catch (e) {
          console.log({e: e.stack});
        }
      },
    );
  };

  return (
    <SafeAreaView
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: '#546E7A',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 25,
          borderRadius: 5,
        }}
        onPress={onImagePick}>
        <Text
          style={{
            color: 'white',
          }}>
          Select Image
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
