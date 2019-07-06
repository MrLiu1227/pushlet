<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork" %>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<ww:bean name="'com.css.apps.base.user.common.UserService'" id="userService" />
<form class="form-horizontal table-form" name="personalMsgForm" id="personalMsgForm" method="post" action="personal/dirPersonalMsg.action" onsubmit="return $action.query(this)">
  <input type="hidden" name="page.orderFlag" id="page.orderFlag" class="order-flag" value="<ww:property value='page.orderFlag'/>"> 
	<input type="hidden" name="page.orderString" id="page.orderString" class="order-string" value="<ww:property value='page.orderString'/>">
	<input type="hidden" name="page.pageSize" id="page.pageSize" class="page-size" value="<ww:property value='page.pageSize'/>">
	<input type="hidden" name="page.totalPages" id="page.totalPages" class="page-count" value="<ww:property value='page.totalPages'/>">
	<input type="hidden" name="page.currentPage" id="page.currentPage" class="page-current" value="<ww:property value='page.currentPage'/>">
	
	<div class="content">
		<div class="box box-primary col-ie" ie-size="20" ie-cols="12">
			<div class="box-header with-border">
				<div class="input-group input-group-sm">
					<div class="table-search">
						<ul>
						  	<li>
				     		<input class="input-medium " type="text" id="item.msgName" name="item.msgName" maxlength="50"  placeholder="请输入消息名称" value="<ww:property value="item.msgName"/>"  />
				     		</li>
						  	<li>
				     		<input class="input-medium " type="text" id="item.msgKeyWord" name="item.msgKeyWord" maxlength="50"  placeholder="请输入消息关键字" value="<ww:property value="item.msgKeyWord"/>"  />
				     		</li>
						  	<li>
				     		<input class="input-medium " type="text" id="item.sender" name="item.sender" maxlength="50"  placeholder="请输入发送方" value="<ww:property value="item.sender"/>"  />
				     		</li>
							<li>
								接收时间：
								<input style="height: 28px" class="input-medium Wdate" id="receiveBeginTime" name="receiveBeginTime" readonly="true" type="text" onclick="WdatePicker({maxDate:'#F{$dp.$D(\'receiveBeginTime\')}'})" value='<ww:property value="new java.text.SimpleDateFormat('yyyy-MM-dd').format(receiveBeginTime)"/>'>
								至
								<input style="height: 28px" class="input-medium Wdate" id="receiveEndTime" name="receiveEndTime" readonly="true" type="text" onclick="WdatePicker({minDate:'#F{$dp.$D(\'receiveEndTime\')}'})" value='<ww:property value="new java.text.SimpleDateFormat('yyyy-MM-dd').format(receiveEndTime)"/>'>
							</li>
						    <li>
						    	<ww:button css="btn btn-sm btn-primary" caption="<i class='fa fa-search'></i> 查询" funcode="acl_personalMsg/dirPersonalMsg" type="submit"></ww:button>
						    </li>
						</ul>
					</div>
				</div>
			</div>
			<!-- /.box-header -->
			<div class="box-body">
				<div class="controls" style="margin: 0px 0px 5px 0px; padding-top: 0px;">
					<!-- Check all button -->
					<div class="btn-group">
						<ww:link funcode="acl_personalMsg/addPersonalMsg" css="btn btn-default btn-sm" caption="<i class='fa fa-plus'></i> 添加" title="添加PERSONAL_MSG" target="cssTab" rel="getPersonalMsg" href="personal/getPersonalMsg.action"></ww:link>
<%--
						<ww:link caption="修改" title="修改门户组件" target="cssDialog" rel="getPtPortlet" href="personal/getPersonalMsg.action"></ww:link>
--%>

					</div>
					<div class="btn-group">
						<ww:link funcode="acl_personalMsg/delPersonalMsg" css="btn btn-default btn-sm" caption="<i class='fa fa-trash-o'></i> 删除" onclick="$action.execBatch(this,{url:'personal/delPersonalMsg.action',title:'确认要进行删除操作?'});"></ww:link>
					</div>
					<div class="btn-group">
						<ww:link funcode="acl_personalMsg/UpdPersonalMsgReadFlag" css="btn btn-default btn-sm" caption="<i class='fa fa-trash-o'></i> 置为已读" onclick="$action.execBatch(this,{url:'personal/UpdPersonalMsgReadFlag.action',title:'确认要进行行置为已读操作?'});"></ww:link>
					</div>

					<div class="btn-group btnTab pull-right">
						<input type="hidden" name="item.readFlag" id="item.readFlag" value="<ww:property value='item.readFlag'/>">
						<ww:if test="item.readFlag == 1">
							<a class="btn btn-primary btn-sm" value="1" href="javascript:;"><i class='fa fa-fw fa-share-alt'></i>已读</a>
							<a class="btn btn-default btn-sm" value="2" href="javascript:;"><i class='fa fa-fw fa-sitemap'></i>未读</a>
						</ww:if>
						<ww:else>
							<a class="btn btn-default btn-sm" value="1" href="javascript:;"><i class='fa fa-fw fa-share-alt'></i>已读</a>
							<a class="btn btn-primary btn-sm" value="2" href="javascript:;"><i class='fa fa-fw fa-sitemap'></i>未读</a>
						</ww:else>
					</div>

				</div>

				<div class="table-responsive">
					<table class="table table-bordered table-striped table-hover">
						<thead>
			<tr>
				<th width="25px"><input group="ids" class="cleck-all" type="checkbox"/></th>
				<th width="120px">操作</th>
     	 		<th width="150px" order-field="msgName" class="order">消息名称</th>
     	 		<th width="150px" order-field="msgType" class="order">消息类型</th>
     	 		<th width="150px" order-field="msgKeyWord" class="order">消息关键字</th>
     	 		<th width="150px" order-field="sender" class="order">发送方</th>
     	 		<th width="150px" order-field="receiveTime" class="order">接收时间</th>
     	 		<th width="150px" order-field="readFlag" class="order">未读/已读</th>
			</tr>
		</thead>
		<tbody>
		  <ww:iterator value="page.results" id="data" status="data">
			<tr>
				<td class="text-center"><input type="checkbox"  name="ids" id="ids" value="<ww:property value="uuid" />"/></td>
				<td class="text-center">
<%--
					<ww:link funcode="acl_personalMsg/getPersonalMsg" caption="修改"  title="修改PERSONAL_MSG"  target="cssTab" rel="getPersonalMsg" href="personal/getPersonalMsg.action?uuid=%{uuid}" ></ww:link>&nbsp;
--%>

					<ww:link funcode="acl_personalMsg/delPersonalMsg" caption="删除" onclick="$action.exec(this,{url:'personal/delPersonalMsg.action?ids=%{uuid}',title:'确认要进行删除操作?'})" href="javascript:;"></ww:link>&nbsp;
				</td>
					<td class="text-center">
						<ww:if test="readFlag == 2">
							<a onclick="changeStyle(this);" id="title<ww:property value='uuid'/>" target="cssTab" style="font-weight: bold" rel="<ww:property value='uuid'/>" title="<ww:property value="bizDiscription"/>" href="personal/getPersonalMsg.action?uuid=<ww:property value='uuid'/>"><ww:property value="msgName"/></a>
						</ww:if>
						<ww:else>
							<a onclick="changeStyle(this);" id="title<ww:property value='uuid'/>" target="cssTab" rel="<ww:property value='uuid'/>" title="<ww:property value="bizDiscription"/>" href="personal/getPersonalMsg.action?uuid=<ww:property value='uuid'/>"><ww:property value="msgName"/></a>
						</ww:else>
					</td>
				<td class="text-center"><ww:property value="#dictID.getDictType('per_msg_type', msgType).name" /></td>
					<td class="text-center"><ww:property value="msgKeyWord"/></td>
					<td class="text-center">   <ww:property value="sender"/> <%--<ww:property value="#userService.getUserRealNameById(sender)"/> --%>  </td>
					<td class="text-center"><ww:property value="new java.text.SimpleDateFormat('yyyy-MM-dd').format(receiveTime)"/></td>
				<td class="text-center"><ww:property value="#dictID.getDictType('per_read_flag', readFlag).name" /></td>
    		</tr>
			</ww:iterator>
		</tbody>
	</table>
				</div>
				<div class="table-pagination">
					<ul class="no-margin">
						<ww:property value="page.pageSplit" />
					</ul>
				</div>
			</div>
			<!-- /.box-body -->
		</div>
	</div>
	
	<script type="text/javascript">
	using('jqupload',function() {
		var $curForm = $('#personalMsgForm');
	});

    function changeStyle(obj){
        $("#"+obj.id).attr("style","font-weight: normal");
    }
</script>
</form>