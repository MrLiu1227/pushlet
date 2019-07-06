<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork" %>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<form class="form-horizontal form-validate" method="post"  <ww:if test="uuid != null">action="personal/updPersonalMsg.action"</ww:if><ww:else>action="personal/addPersonalMsg.action"</ww:else> onsubmit="return $action.submit(this);">
        <ww:cssToken />
  	<input type="hidden" name="uuid" id="uuid" value="<ww:property value='item.uuid'/>">
	<%--添加默认为删除状态为2（未删除）--%>
	<ww:if test="uuid == null">
		<input type="hidden" name="delStatus" id="delStatus" value="2">
	</ww:if>
	<ww:else>
		<input type="hidden" name="delStatus" id="delStatus" value="<ww:property value='item.delStatus'/>">
	</ww:else>
	<%--添加默认为阅读状态为2（未读）--%>
	<ww:if test="uuid == null">
		<input type="hidden" name="readFlag" id="readFlag" value="2">
	</ww:if>
	<ww:else>
		<input type="hidden" name="readFlag" id="readFlag" value="<ww:property value='item.readFlag'/>">
	</ww:else>

<div class="content" style="min-width: 500px;">
	<div class="box box-primary with-border">
		<div class="box-header with-border">
			<h3 class="box-title"><ww:if test="uuid != null">查看</ww:if><ww:else>添加</ww:else>信息</h3>
			<%--<div class="pull-right box-tools">
				<button class="btn btn-sm btn-primary" type="button" onclick="$(this).submit();"> <i class="fa fa-save"></i> 保存</button>
			</div>--%>
		</div>
	<div class="box-body previewTable">
		
  <table class="table table-bordered editTable form-group-sm">
			<thead>
				<tr>
					<th colspan="12">PERSONAL_MSG</th>
				</tr>
			</thead>
		<tr class="firstRow">
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
			<td colspan="1" class="col-md-1"></td>
		</tr>

	  <tr>
		  <td colspan="3" class="tdLable">
			  消息名称</td>
		  <td colspan="9">
			  <input type="text" maxlength="100" placeholder="请输入消息名称"  class="form-control" readonly name="msgName" id="msgName" value="<ww:property value='item.msgName'/>" >
		  </td>
	  </tr>
		<tr>
			<td colspan="3" class="tdLable">
				消息类型</td>
    		<td colspan="9" >
				<input type="text" maxlength="100" placeholder="请输入消息类型"  class="form-control " readonly name="msgType" id="msgType" value="<ww:property value="#dictID.getDictType('per_msg_type', item.msgType).name" />" >
			</td>
		</tr>

		<tr>
			<td colspan="3" class="tdLable">
				消息关键字</td>
    		<td colspan="9">
		  	<input type="text" maxlength="100" placeholder="请输入消息关键字"  class="form-control" readonly  name="msgKeyWord" id="msgKeyWord" value="<ww:property value='item.msgKeyWord'/>" >
			</td>
		</tr>
        <tr>
          <td colspan="3" class="tdLable">
              消息内容</td>
          <td colspan="9">
              <textarea name="msgContent" id="msgContent" class="form-control" readonly  rows="10"><ww:property value="@com.css.util.RegexCheck@textArea(item.msgContent)"/></textarea>
          </td>
        </tr>
		<tr>
			<td colspan="3" class="tdLable">
				发送方</td>
    		<td colspan="9">
		  	<input type="text" maxlength="100" placeholder="请输入发送方"  class="form-control" readonly name="sender" id="sender" value="<ww:property value='item.sender'/>" >
			</td>
		</tr>
		<tr>
			<td colspan="3" class="tdLable">
				接收者</td>
    		<td colspan="9">
		  	<input type="text" maxlength="100" placeholder="请输入接收者"  class="form-control" readonly name="receiver" id="receiver" value="<ww:property value='item.receiver'/>" >
			</td>
		</tr>
		<tr>
			<td colspan="3" class="tdLable">
				接收时间</td>
    		<td colspan="9">
		 	<input type="text" maxlength="20" class="form-control Wdate" name="receiveTime" id="receiveTime" readonly <%--onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" --%>value='<ww:property value="new java.text.SimpleDateFormat('yyyy-MM-dd').format(item.receiveTime)"/>'>
			</td>
		</tr>
		<%--<tr>
			<td colspan="3" class="tdLable">
				删除标志</td>
    		<td colspan="9">
		  	<input type="text" maxlength="100" placeholder="请输入删除标志"  class="form-control" name="delStatus" id="delStatus" value="<ww:property value='item.delStatus'/>" >
			</td>
		</tr>--%>
		<%--<tr>
			<td colspan="3" class="tdLable">
				未读/已读</td>
    		<td colspan="9">
		 		 <ww:select attributes="class='form-control'" name="readFlag" id="readFlag" value="item.readFlag"  list="#dictID.getDictListSel('d_root','d_sex')" listKey="code" listValue="name"></ww:select>
			</td>
		</tr>--%>
  </table>
		</div>
	</div>
</div>

</form>