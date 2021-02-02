import AttachedFederationPlugin from './attachedfederation';
import FederationRuntime from './federationruntime';
import LastExportModulePlugin from './lastexportmodule';

AttachedFederationPlugin.FederationRuntime = FederationRuntime;
AttachedFederationPlugin.LastExportModulePlugin = LastExportModulePlugin;
AttachedFederationPlugin.setRuntimeUrl = FederationRuntime.setRuntimeUrl;
AttachedFederationPlugin.getRuntimeUrl = FederationRuntime.getRuntimeUrl;
export default AttachedFederationPlugin;
