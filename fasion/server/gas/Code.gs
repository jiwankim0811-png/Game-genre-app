/**
 * ==============================================================================
 * Google Apps Script (GAS) - 장르나침반 (GenreCompass) 컨트롤러 (Code.gs)
 * Stitch 프로젝트 연동: projects/6324336699399294728 (GenreCompass Game Guide)
 * ==============================================================================
 */

/**
 * 웹 앱 진입점: 사용자가 웹 앱 URL에 접속할 때 index.html을 렌더링합니다.
 * @param {Object} e - HTTP GET 이벤트 객체
 * @return {HtmlOutput} 브라우저로 전달될 HTML 페이지
 */
function doGet(e) {
  try {
    const template = HtmlService.createTemplateFromFile('index');
    template.projectId = 'projects/6324336699399294728';
    const propUrl = PropertiesService.getScriptProperties().getProperty('SERVICE_URL');
    template.defaultServerUrl = propUrl || 'https://game-genre-app-epaw6mtefq-uc.a.run.app';

    const htmlOutput = template.evaluate()
      .setTitle('장르나침반 (GenreCompass) | 내 취향 좌표로 찾는 게임 장르')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    return htmlOutput;
  } catch (error) {
    Logger.log('[doGet 오류] ' + error.toString());
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif; padding:20px; color:#d93025; background:#0f131c;">' +
      '<h3>웹 애플리케이션 초기화 실패</h3>' +
      '<p>' + error.message + '</p>' +
      '</div>'
    );
  }
}

/**
 * 웹훅 엔드포인트: Cloud Run 배포 완료 후 전달된 서비스 URL을 PropertiesService에 저장합니다.
 * @param {Object} e - HTTP POST 이벤트 객체
 * @return {TextOutput} JSON 응답
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const serviceUrl = data.serviceUrl || data.url;
    if (serviceUrl) {
      PropertiesService.getScriptProperties().setProperty('SERVICE_URL', serviceUrl);
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok', serviceUrl: serviceUrl }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'ignored', reason: 'No serviceUrl provided' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 백엔드 API 호출 유틸리티
 * @param {string} endpoint - API 엔드포인트 상대 경로
 * @param {Object} payload - 요청 페이로드
 * @return {Object} 백엔드 응답 데이터
 */
function callBackendApi(endpoint, payload) {
  const serverUrl = PropertiesService.getScriptProperties().getProperty('SERVICE_URL');
  if (!serverUrl) {
    return { success: false, error: '백엔드 서버 URL이 설정되지 않았습니다.' };
  }

  const url = serverUrl.replace(/\/+$/, '') + '/' + endpoint.replace(/^\/+/, '');
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload || {}),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();
    const contentText = response.getContentText();

    if (statusCode >= 200 && statusCode < 300) {
      return { success: true, data: JSON.parse(contentText) };
    } else {
      return { success: false, statusCode: statusCode, error: contentText };
    }
  } catch (err) {
    Logger.log('[callBackendApi 실패] ' + err.toString());
    return { success: false, error: err.message };
  }
}
