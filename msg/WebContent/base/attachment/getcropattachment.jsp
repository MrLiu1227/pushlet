<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<form class="form-horizontal form-validate" id="getCropAttachmentForm">
	<div class="row content-sm" style="width: 900px; height: 510px">
		<div class="divSection col-md-9">
			<div class="crop-wrapper">
				<img src="<ww:property value="item.getUrl()" />" />
			</div>
		</div>
		<div class="divSectionLast col-md-3 col-ie" ie-size="20" ie-cols="3">
			<div>
				<button type="button" class="btn btn-primary crop-save" style="width: 87px">
					<i class="fa fa-save"></i> 保存
				</button>
				<button type="button" onclick="$css.closeDialog()" class="btn btn-primary" style="width: 87px">
					<i class="fa fa-close"></i> 关闭
				</button>
			</div>
			<div class="crop-preview preview0"></div>
			<div class="crop-preview preview1"></div>
			<div class="crop-preview preview2"></div>
		</div>
	</div>
</form>
<script type="text/javascript">
	$(function() {
		$cropApp.init({
			extraPara : <ww:property value="config.getExtraPara()" />,
			extraData : <ww:if test="item==null||item.extraData==null">null</ww:if><ww:else><ww:property value="item.extraData" /></ww:else>,
			cropForm : '#getCropAttachmentForm',
			cropPreview : '.crop-preview'
		});
	});
</script>