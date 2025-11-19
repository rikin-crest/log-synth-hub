export const sample_res = {
  thread_id: "aa4e1c61-e577-4495-aa6f-ce49dab03e52",
  output: [
    {
      "RawLog Field Name": null,
      "UDM Field Name": "metadata.event_type",
      Logic: 'metadata.event_type => "PROCESS_LAUNCH"',
      "LLM Reasoning":
        "The log schema provided describes a process-centric event. It contains detailed information about the process being created, such as 'InitiatingProcessId', 'InitiatingProcessCommandLine', 'InitiatingProcessCreationTime', and details about its parent process ('InitiatingProcessParentId', 'InitiatingProcessParentFileName'). The file-related attributes like 'FileName', 'FolderPath', and various hashes (SHA1, MD5) describe the executable file that is being launched. This comprehensive information about the creation and context of a new process strongly indicates a 'PROCESS_LAUNCH' event.",
      "Confidence Score": 95,
    },
    {
      "RawLog Field Name": "properties.Timestamp",
      "UDM Field Name": "metadata.event_timestamp",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.Timestamp' represents the time when the event was recorded. This directly corresponds to the UDM field 'metadata.event_timestamp', which is used to store the time the event was generated. Therefore, mapping 'properties.Timestamp' to 'metadata.event_timestamp' is the most appropriate choice.",
      "Confidence Score": 98,
    },
    {
      "RawLog Field Name": "properties.DeviceId",
      "UDM Field Name": "principal.asset.asset_id",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.DeviceId' is a unique identifier for the device where the event occurred. The UDM field 'principal.asset.asset_id' is designed to store a product-specific identifier for the asset that is the principal actor in the event. As the device is the principal entity, mapping 'properties.DeviceId' to 'principal.asset.asset_id' is the correct approach.",
      "Confidence Score": 92,
    },
    {
      "RawLog Field Name": "properties.DeviceName",
      "UDM Field Name": "principal.hostname",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.DeviceName' contains the fully qualified domain name (FQDN) of the device. This maps directly to the UDM field 'principal.hostname', which is intended to store the hostname of the principal entity in the event. Thus, 'properties.DeviceName' is best mapped to 'principal.hostname'.",
      "Confidence Score": 94,
    },
    {
      "RawLog Field Name": "properties.ActionType",
      "UDM Field Name": "metadata.product_event_type",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.ActionType' describes the specific type of activity that triggered the event. The UDM field 'metadata.product_event_type' is used to store the product-specific event name or type. Mapping 'properties.ActionType' to 'metadata.product_event_type' preserves the original event classification from the source product.",
      "Confidence Score": 90,
    },
    {
      "RawLog Field Name": "properties.FileName",
      "UDM Field Name": "about.file.full_path",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.FileName' specifies the name of the file involved in the event. In the context of a PROCESS_LAUNCH event, this file is the executable being launched. The UDM field 'about.file.full_path' is used to store the full path of a file that is the subject of the event. Therefore, 'properties.FileName' should be mapped to 'about.file.full_path'.",
      "Confidence Score": 88,
    },
    {
      "RawLog Field Name": "properties.FolderPath",
      "UDM Field Name": "about.file.full_path",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.FolderPath' indicates the folder containing the file involved in the event. This should be combined with the file name to form the full path. The UDM field 'about.file.full_path' is the appropriate destination for the complete file path. Thus, 'properties.FolderPath' is mapped to 'about.file.full_path'.",
      "Confidence Score": 85,
    },
    {
      "RawLog Field Name": "properties.SHA1",
      "UDM Field Name": "about.file.sha1",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.SHA1' contains the SHA-1 hash of the file involved in the event. The UDM field 'about.file.sha1' is designated for storing the SHA-1 hash of a file that is the subject of the event. Consequently, 'properties.SHA1' should be mapped to 'about.file.sha1'.",
      "Confidence Score": 99,
    },
    {
      "RawLog Field Name": "properties.SHA256",
      "UDM Field Name": "about.file.sha256",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.SHA256' holds the SHA-256 hash of the file. This directly corresponds to the UDM field 'about.file.sha256', which is intended for the SHA-256 hash of a file that is the subject of an event. Therefore, 'properties.SHA256' is mapped to 'about.file.sha256'.",
      "Confidence Score": 99,
    },
    {
      "RawLog Field Name": "properties.MD5",
      "UDM Field Name": "about.file.md5",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.MD5' provides the MD5 hash of the file. The UDM field 'about.file.md5' is the standard location for storing the MD5 hash of a file that is the subject of an event. As such, 'properties.MD5' is mapped to 'about.file.md5'.",
      "Confidence Score": 99,
    },
    {
      "RawLog Field Name": "properties.FileSize",
      "UDM Field Name": "about.file.size",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.FileSize' specifies the size of the file in bytes. This maps directly to the UDM field 'about.file.size', which is used to store the size of a file that is the subject of an event. Hence, 'properties.FileSize' is mapped to 'about.file.size'.",
      "Confidence Score": 96,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessAccountDomain",
      "UDM Field Name": "principal.administrative_domain",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessAccountDomain' indicates the domain of the account that ran the process. The UDM field 'principal.administrative_domain' is used to store the administrative domain of the principal entity. Since the initiating process is the principal, this mapping is appropriate.",
      "Confidence Score": 93,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessAccountName",
      "UDM Field Name": "principal.user.userid",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessAccountName' contains the user name of the account that ran the process. This directly maps to the UDM field 'principal.user.userid', which is intended for the user ID of the principal actor. Therefore, this is the correct mapping.",
      "Confidence Score": 95,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessAccountSid",
      "UDM Field Name": "principal.user.windows_sid",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessAccountSid' is the Security Identifier (SID) of the account. The UDM provides a specific field for this, 'principal.user.windows_sid'. As the SID is a Windows-specific identifier, mapping it to this field is the most accurate choice.",
      "Confidence Score": 97,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessAccountUpn",
      "UDM Field Name": "principal.user.email_addresses",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessAccountUpn' contains the User Principal Name (UPN) of the account. UPNs are often formatted as email addresses, and the UDM field 'principal.user.email_addresses' is the most suitable place to store this information. Thus, this mapping is appropriate.",
      "Confidence Score": 91,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessAccountObjectId",
      "UDM Field Name": "principal.user.product_object_id",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessAccountObjectId' is a Microsoft Entra object ID, which is a vendor-specific identifier for the user account. The UDM field 'principal.user.product_object_id' is designed to hold such product-specific identifiers. Therefore, this is the correct mapping.",
      "Confidence Score": 89,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessIntegrityLevel",
      "UDM Field Name": "additional.fields[initiating_process_integrity_level]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessIntegrityLevel' describes the integrity level of the process, a Windows-specific security feature. There is no direct equivalent in the UDM for this field. Therefore, it is best mapped to 'additional.fields' to preserve the information without losing context.",
      "Confidence Score": 85,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessTokenElevation",
      "UDM Field Name": "principal.process.token_elevation_type",
      Logic:
        'if event["properties"]["InitiatingProcessTokenElevation"] == "TokenElevationTypeDefault" {\n"principal.process.token_elevation_type" => "TYPE_2"\n} else if event["properties"]["InitiatingProcessTokenElevation"] == "TokenElevationTypeFull" {\n"principal.process.token_elevation_type" => "TYPE_1"\n} else if event["properties"]["InitiatingProcessTokenElevation"] == "TokenElevationTypeLimited" {\n"principal.process.token_elevation_type" => "TYPE_3"\n} else {\n"principal.process.token_elevation_type" => "UNKNOWN"\n}',
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessTokenElevation' indicates the token elevation type of the process. This directly corresponds to the UDM field 'principal.process.token_elevation_type', which is an enum. A logic is required to map the source values to the UDM enum values.",
      "Confidence Score": 94,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessSHA1",
      "UDM Field Name": "principal.process.file.sha1",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessSHA1' contains the SHA-1 hash of the initiating process's image file. This maps directly to the UDM field 'principal.process.file.sha1', which is intended for the SHA-1 hash of the principal process's file.",
      "Confidence Score": 77,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessSHA256",
      "UDM Field Name": "principal.process.file.sha256",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessSHA256' holds the SHA-256 hash of the initiating process's image file. This corresponds to the UDM field 'principal.process.file.sha256', which is the designated field for the SHA-256 hash of the principal process's file.",
      "Confidence Score": 98,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessFileName",
      "UDM Field Name": "principal.process.file.full_path",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessFileName' is the name of the process file that initiated the event. This should be part of the full path of the process executable. The UDM field 'principal.process.file.full_path' is the appropriate destination for this information.",
      "Confidence Score": 87,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessFileSize",
      "UDM Field Name": "principal.process.file.size",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessFileSize' specifies the size of the file that ran the process. This maps directly to the UDM field 'principal.process.file.size', which is used to store the size of the principal process's file.",
      "Confidence Score": 96,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessVersionInfoCompanyName",
      "UDM Field Name": "additional.fields[initiating_process_version_info_company_name]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessVersionInfoCompanyName' contains the company name from the version information of the process. There is no specific UDM field for this information. Therefore, it is best mapped to 'additional.fields' to ensure the data is not lost.",
      "Confidence Score": 80,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessVersionInfoProductName",
      "UDM Field Name": "additional.fields[initiating_process_version_info_product_name]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessVersionInfoProductName' holds the product name from the version information of the process. As there is no dedicated UDM field for this, mapping it to 'additional.fields' is the most suitable option to preserve the information.",
      "Confidence Score": 80,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessVersionInfoProductVersion",
      "UDM Field Name": "additional.fields[initiating_process_version_info_product_version]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessVersionInfoProductVersion' provides the product version from the version information of the process. Since there is no specific UDM field for this, it should be mapped to 'additional.fields' to retain the data.",
      "Confidence Score": 80,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessVersionInfoInternalFileName",
      "UDM Field Name": "additional.fields[initiating_process_version_info_internal_file_name]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessVersionInfoInternalFileName' contains the internal file name from the version information of the process. There is no direct UDM equivalent for this field, so it is best mapped to 'additional.fields' to preserve the information.",
      "Confidence Score": 80,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessVersionInfoOriginalFileName",
      "UDM Field Name": "additional.fields[initiating_process_version_info_original_file_name]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessVersionInfoOriginalFileName' holds the original file name from the version information of the process. As there is no dedicated UDM field for this, mapping it to 'additional.fields' is the most appropriate choice to avoid data loss.",
      "Confidence Score": 80,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessVersionInfoFileDescription",
      "UDM Field Name": "additional.fields[initiating_process_version_info_file_description]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessVersionInfoFileDescription' provides the file description from the version information of the process. Since there is no specific UDM field for this, it should be mapped to 'additional.fields' to ensure the information is retained.",
      "Confidence Score": 80,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessId",
      "UDM Field Name": "principal.process.pid",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessId' is the Process ID (PID) of the process that initiated the event. This directly maps to the UDM field 'principal.process.pid', which is the standard field for the principal process's PID.",
      "Confidence Score": 99,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessCommandLine",
      "UDM Field Name": "principal.process.command_line",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessCommandLine' contains the command line used to run the process. This maps directly to the UDM field 'principal.process.command_line', which is the designated field for the command line of the principal process.",
      "Confidence Score": 95,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessCreationTime",
      "UDM Field Name": "principal.attribute.creation_time",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessCreationTime' indicates when the initiating process was started. The UDM field 'principal.attribute.creation_time' is used to store the creation time of the principal entity. Therefore, this is the correct mapping.",
      "Confidence Score": 92,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessFolderPath",
      "UDM Field Name": "principal.process.file.full_path",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessFolderPath' is the folder containing the initiating process's image file. This should be combined with the file name to form the full path. The UDM field 'principal.process.file.full_path' is the appropriate destination for this information.",
      "Confidence Score": 85,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessParentId",
      "UDM Field Name": "principal.process.parent_process.pid",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessParentId' is the Process ID (PID) of the parent process. This maps directly to the UDM field 'principal.process.parent_process.pid', which is the standard field for the parent process's PID.",
      "Confidence Score": 97,
    },
    {
      "RawLog Field Name": "properties.InitiatingProcessParentCreationTime",
      "UDM Field Name": "additional.fields[initiating_process_parent_creation_time]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.InitiatingProcessParentCreationTime' indicates when the parent process was started. There is no specific field in the UDM 'Process' object for the parent process's creation time. Therefore, it is best mapped to 'additional.fields' to preserve the information.",
      "Confidence Score": 82,
    },
    {
      "RawLog Field Name": "properties.ReportId",
      "UDM Field Name": "metadata.product_log_id",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.ReportId' is an event identifier. The UDM field 'metadata.product_log_id' is used to store a vendor-specific event identifier. Therefore, mapping 'properties.ReportId' to 'metadata.product_log_id' is the correct choice.",
      "Confidence Score": 96,
    },
    {
      "RawLog Field Name": "properties.AppGuardContainerId",
      "UDM Field Name": "additional.fields[app_guard_container_id]",
      Logic: null,
      "LLM Reasoning":
        "The raw log field 'properties.AppGuardContainerId' is an identifier for a virtualized container used by a specific security feature. There is no direct UDM equivalent for this field. Therefore, it should be mapped to 'additional.fields' to ensure the information is not lost.",
      "Confidence Score": 80,
    },
  ],
};
