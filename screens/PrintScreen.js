import React, { useRef } from 'react'
import { View, Text, Button, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'
import { cleanCart } from '../CartReducer'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
function PrintScreen({ route }) {
  const { clientName, livreurName, isGros } = route.params
  const dispatch = useDispatch()
  const goHome = async () => {
    dispatch(cleanCart())
    navigation.navigate('Home')
  }
  const cartItems = useSelector((state) => state.cart.cart)
  function getTotalPrice(code, cartItems) {
    var price = '0.0'
    if (code == 'Détail') {
      price = cartItems
        .map(
          (item) =>
            parseInt(item.qte) *
              parseFloat(item.prix1) *
              parseInt(item.quantity) +
            parseInt(item.qteP) * parseFloat(item.prix1)
        )
        .reduce((curr, prev) => curr + prev, 0)
    }
    if (code == 'Gros') {
      price = cartItems
        .map(
          (item) =>
            parseInt(item.qte) *
              parseFloat(item.prix2) *
              parseInt(item.quantity) +
            parseInt(item.qteP) * parseFloat(item.prix2)
        )
        .reduce((curr, prev) => curr + prev, 0)
    }
    if (code == 'Super Gros') {
      price = cartItems
        .map(
          (item) =>
            parseInt(item.qte) *
              parseFloat(item.prix3) *
              parseInt(item.quantity) +
            parseInt(item.qteP) * parseFloat(item.prix3)
        )
        .reduce((curr, prev) => curr + prev, 0)
    }
    return price
  }
  const totalPrice = getTotalPrice(isGros, cartItems)
  const webViewRef = useRef(null)

  const handlePrintInvoice = async () => {
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
    })
    const fileUri = `${FileSystem.documentDirectory}example.pdf`

    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    })

    console.log('PDF file saved:', fileUri)

    Sharing.shareAsync(fileUri)
  }
  function getPrice(code, item) {
    var price = '0.0'
    if (code == 'Détail') {
      price = item.prix1
    }
    if (code == 'Gros') {
      price = item.prix2
    }
    if (code == 'Super Gros') {
      price = item.prix3
    }
    return price
  }
  const invoiceItems = cartItems
    .map(
      (item) =>
        `<tr><td>${item.name
          .toString()
          .substring(0, 18)}</td><td class="boldPrice">${parseFloat(
          getPrice(isGros, item)
        ).toFixed(2)}</td><td class="boldPrice">${
          parseInt(item.qte) * parseInt(item.quantity) + parseInt(item.qteP)
        }</td><td class="boldPrice">${(
          parseInt(item.qte) *
            parseFloat(getPrice(isGros, item)) *
            parseInt(item.quantity) +
          parseInt(item.qteP) * parseFloat(getPrice(isGros, item))
        ).toFixed(2)}</td></tr>`
    )
    .join('')
  function formatDate(date) {
    var year = date.getFullYear()
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var day = ('0' + date.getDate()).slice(-2)

    var formattedDate = year + '-' + month + '-' + day
    return formattedDate
  }
  const date = formatDate(new Date())
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .invoice {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;

      }
      .logo {
        width: 150px;
        height: 75px;
        margin: 10px auto;
        padding: 10px;
      }
      .invoice-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .invoice-details {
        margin-bottom: 20px;
      }
      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .invoice-table th,
      .invoice-table td {
        padding: 10px;
        border: 1px solid #ccc;
        font-size: 32px;
      }
      .boldPrice {
        font-weight: 1000;
      }
      .title {
        font-weight: 1000;
        font-size: 42px;
      }
      .titles {
        font-size: 36px;
      }
      .invoice-table th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
      .invoice-total {
        text-align: right;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="invoice">
      <div class="invoice-header">
      <p class='title'>Facture Soummam</p>
      </div>
      <div class="invoice-details">
      <img class='logo' src='https://firebasestorage.googleapis.com/v0/b/soummam-laghouat.appspot.com/o/Soummam.png?alt=media&token=b97e2d0e-1d97-4fb9-9068-b7450e70bd07&_gl=1*17y2uq6*_ga*MTE3NjY2MTYxMy4xNjgyNjIzODMx*_ga_CW55HF8NVT*MTY4NjU4NTQwMS44MC4xLjE2ODY1ODU0NzYuMC4wLjA.' />
        <p class='titles'><strong>Date:</strong> ${date}</p>
        <p class='titles'><strong>Client:</strong> ${clientName}</p>
        <p class='titles'><strong>Livreur:</strong> ${livreurName}</p>
      </div>
      <table class="invoice-table">
          <tbody>
          <tr>
              <th>Produit</th>
              <th>Prix</th>
              <th>Qte</th>
              <th>Total</th>
            </tr>
            ${invoiceItems}
            <tr>
              <td colspan="2" class="invoice-total">Total</td>
              <td colspan="3" class="boldPrice">${parseFloat(
                totalPrice
              ).toFixed(2)} DA</td>
            </tr>
          </tbody>
        </table>
        
      </div>
    </body>
    </html>
  `

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <WebView
        ref={webViewRef}
        style={{ flex: 1, height: Dimensions.get('window').height }}
        source={{ html: htmlContent }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccessFromFileURLs
        startInLoadingState
        originWhitelist={['*']}
        mixedContentMode="compatibility"
      />
      <Button title="Imprimer" onPress={handlePrintInvoice} />
    </View>
  )
}

export default PrintScreen
