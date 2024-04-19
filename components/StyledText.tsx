import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

interface LoaderProps {
  isLoading?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <Modal transparent visible={isLoading}>
        <View style={styles.modalBackground}>
          <ActivityIndicator size={45} color={'blue'} />
        </View>
      </Modal>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  }
});

export default Loader;
