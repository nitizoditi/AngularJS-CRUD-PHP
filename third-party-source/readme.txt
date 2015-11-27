dompdf-master 中需要 php-font-lib-master
不過 php-font-lib-master 是額外下載，所以分開了

記得修改 dompdf_config.inc.php 內 require_once 的路徑
require_once(DOMPDF_LIB_DIR . "/php-font-lib/classes/Font.php");

download dompdf-master link:
https://github.com/dompdf/dompdf

download php-font-lib-master link:
https://github.com/PhenX/php-font-lib