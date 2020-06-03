/* eslint-disable no-await-in-loop */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';
import api from '~/services/api';

import Card from '~/components/Card';
import Header from '~/components/Header';
import Loading from '~/components/Loading';
import ReportCard from '~/components/ReportCard';

import { sendAllRequest } from '~/store/modules/reports/actions';
import Colors from '~/styles/colors';

import { translate } from '~/locales';

function MyReports({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const network = useSelector((state) => state.network);
  const archivedReports = useSelector((state) => state.reports.reportsNotSent);
  const reportsSent = useSelector((state) => state.reports.reportsSent);
  const [userReports, setUserReports] = useState([]);
  // const [archivedReports, setArchivedReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const updateReports = async () => {
      setRefresh(false);
      setLoading(true);

      const reports = [];

      // const codeResponse = await AsyncStorage.getItem('USER_REPORTS');
      // const archivedResponse = await AsyncStorage.getItem('ARCHIVED_REPORTS');

      // const reportCodes = JSON.parse(codeResponse);
      // const archivedRep = JSON.parse(archivedResponse);

      // console.log(archivedRep);
      setLoading(true);

      if (reportsSent.length) {
        for (const [, { code }] of reportsSent.entries()) {
          try {
            const { data: report } = await api.get(`/denunciations/${code}`);

            reports.push(report);

            setUserReports(reports);
          } catch (err) {
            setLoading(false);
          }
        }
      } else {
        setUserReports([]);
      }
      setLoading(false);

      // if (archivedRep) {
      //   setArchivedReports(archivedRep);
      // } else {
      //   setArchivedReports(null);
      // }
    };

    if (isFocused) {
      updateReports();
    }
  }, [refresh, reportsSent, isFocused]);

  useEffect(() => {
    if (archivedReports.length) {
      dispatch(sendAllRequest());
    } else {
      setRefresh(true);
    }
  }, [network]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Header
        title={translate('myReports')}
        iconLeft="menu"
        onPressLeft={() => navigation.toggleDrawer()}
        iconRight="refresh"
        onPressRight={() => {
          if (archivedReports.length) {
            dispatch(sendAllRequest());
          } else {
            setRefresh(true);
          }
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title={translate('sentReports')}>
          {!network.isConnected ? (
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              {translate('checkConnectionInternet')}.
            </Text>
          ) : userReports.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={userReports}
              keyExtractor={(item) => item.denunciation.id.toString()}
              renderItem={({ item }) => (
                <ReportCard
                  code={item.denunciation.code}
                  type={item.denunciation.type}
                  timestamp={item.denunciation.timestamp}
                  statusId={item.statusDenunciation.state_id}
                  uri={
                    item.denunciation.files.length
                      ? item.denunciation.files[0].url
                      : null
                  }
                />
              )}
            />
          ) : (
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              {translate('noInternetConnection')}
            </Text>
          )}
        </Card>
        <Card title={translate('archivedReports')}>
          {/* {archivedReports.length ? (
            <ReportCard
              code={archivedReports.code}
              type={archivedReports.type}
              statusId={1}
              timestamp={archivedReports.timestamp}
              uri={archivedReports.image[0].uri}
            />
          ) : (
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              Você não possui denúncias arquivadas
            </Text>
          )} */}

          {archivedReports.length > 0 ? (
            <FlatList
              data={archivedReports}
              keyExtractor={() => Math.random().toString()}
              renderItem={({ item }) => (
                <ReportCard
                  code={item.code}
                  type={item.type}
                  statusId={1}
                  timestamp={item.timestamp}
                  uri={item.image[0].uri}
                />
              )}
            />
          ) : (
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              {translate('noArchivedReports')}
            </Text>
          )}
        </Card>
      </ScrollView>

      {/* </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#e8f5fd',
    padding: 15,
  },
  container: {
    flex: 1,
    height: '100%',
  },
});

export default MyReports;
