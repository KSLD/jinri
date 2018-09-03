<?php
class database{
    public $pdo;
    public function __construct()
    {
        $db = array(
            'dsn' => 'mysql:host=localhost;dbname=wuif1805;port=3306;charset=utf8',
            'dbname'=>'wuif1805',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8',
        );

        $options = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        );

        try{
            $this->pdo = new PDO($db['dsn'], $db['username'], $db['password'], $options);
        }catch(PDOException $e){
            die('数据库连接失败:' . $e->getMessage());
        }
    }
}
class Page extends database {

    public function actionChannel()
    {
        include '../channel.html';
    }
    public function actionSearch()
    {
        include '../search.html';
    }
    public function actionIndex()
    {
        include '../index.html';
    }
}
$page=new Page();
if(isset($_GET['r'])){
    $method='action'.$_GET['r'];
}else{
    $method='actionIndex';
}
$method='action'.$_GET['r'];
$page->$method();