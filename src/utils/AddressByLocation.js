import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyAKZxm85lnVjuiqzwEiAjjn6hTioyDLDrQ');

export default async ({ latitude, longitude }) => {
  try {
    const response = await Geocoder.from({ latitude, longitude });

    const number = response.results.reduce((n, result) => {
      if (n !== '') return n;

      const address = result.address_components.find((component) =>
        component.types.includes('street_number')
      );
      if (n === '' && address) {
        return n + address.long_name;
      }
      return n;
    }, '');

    const place = response.results.reduce((n, result) => {
      if (n !== '') return n;

      const address = result.address_components.find((component) =>
        component.types.includes('route')
      );
      if (n === '' && address) {
        return n + address.long_name;
      }
      return n;
    }, '');

    const zone = response.results.reduce((n, result) => {
      if (n !== '') return n;

      const address = result.address_components.find(
        (component) =>
          component.types.includes('political') ||
          component.types.includes('sublocality')
      );
      if (n === '' && address) {
        return n + address.long_name;
      }
      return n;
    }, '');

    const city = response.results.reduce((n, result) => {
      if (n !== '') return n;

      const address = result.address_components.find((component) =>
        component.types.includes('administrative_area_level_2')
      );
      if (n === '' && address) {
        return n + address.long_name;
      }
      return n;
    }, '');

    const state = response.results.reduce((n, result) => {
      if (n !== '') return n;

      const address = result.address_components.find((component) =>
        component.types.includes('administrative_area_level_1')
      );
      if (n === '' && address) {
        return n + address.long_name;
      }
      return n;
    }, '');

    const cep = response.results.reduce((n, result) => {
      if (n !== '') return n;

      const address = result.address_components.find((component) =>
        component.types.includes('postal_code')
      );
      if (n === '' && address) {
        return n + address.long_name;
      }
      return n;
    }, '');

    return { number, place, zone, city, state, cep, latitude, longitude };
  } catch (e) {
    throw new Error('It was not possible to get the address data');
  }
};
