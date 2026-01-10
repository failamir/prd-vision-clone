// ============================
// EDIT HANDLERS TO BE ADDED AFTER LINE 1258
// ============================

// Edit Handlers for Step 3
const handleEditDeck = (row: any) => {
    setEditingDeckId(row.id);
    setNewDeck({
        vessel_name_type: row.vessel_name_type || "",
        gt_loa: row.gt_loa || "",
        route: row.route || "",
        position: row.position || "",
        start_date: row.start_date || "",
        end_date: row.end_date || "",
        reason: row.reason || "",
        job_description: row.job_description || "",
        file: null,
    });
};

const handleCancelDeckEdit = () => {
    setEditingDeckId(null);
    setNewDeck({
        vessel_name_type: "",
        gt_loa: "",
        route: "",
        position: "",
        start_date: "",
        end_date: "",
        reason: "",
        job_description: "",
        file: null,
    });
};

const handleEditCertificate = (row: any) => {
    setEditingCertificateId(row.id);
    setNewCertificate({
        type_certificate: row.type_certificate || "",
        institution: row.institution || "",
        place: row.place || "",
        cert_number: row.cert_number || "",
        date_of_issue: row.date_of_issue || "",
        file: null,
    });
};

const handleCancelCertificateEdit = () => {
    setEditingCertificateId(null);
    setNewCertificate({
        type_certificate: "",
        institution: "",
        place: "",
        cert_number: "",
        date_of_issue: "",
        file: null,
    });
};

const handleEditTravel = (row: any) => {
    setEditingTravelId(row.id);
    setNewTravel({
        document_type: row.document_type || "",
        document_number: row.document_number || "",
        issuing_authority: row.issuing_authority || "",
        issue_date: row.issue_date || "",
        expiry_date: row.expiry_date || "",
        file: null,
    });
};

const handleCancelTravelEdit = () => {
    setEditingTravelId(null);
    setNewTravel({
        document_type: "",
        document_number: "",
        issuing_authority: "",
        issue_date: "",
        expiry_date: "",
        file: null,
    });
};

const handleEditEducation = (row: any) => {
    setEditingEducationId(row.id);
    setNewEducation({
        institution: row.institution || "",
        start_date: row.start_date || "",
        end_date: row.end_date || "",
        degree: row.degree || "",
    });
};

const handleCancelEducationEdit = () => {
    setEditingEducationId(null);
    setNewEducation({
        institution: "",
        start_date: "",
        end_date: "",
        degree: "",
    });
};

const handleEditReference = (row: any) => {
    setEditingReferenceId(row.id);
    setNewReference({
        full_name: row.full_name || "",
        company: row.company || "",
        position: row.position || "",
        phone: row.phone || "",
        email: row.email || "",
        relationship: row.relationship || "",
    });
};

const handleCancelReferenceEdit = () => {
    setEditingReferenceId(null);
    setNewReference({
        full_name: "",
        company: "",
        position: "",
        phone: "",
        email: "",
        relationship: "",
    });
};

const handleEditNextOfKin = (row: any) => {
    setEditingNextOfKinId(row.id);
    setNewNextOfKin({
        full_name: row.full_name || "",
        relationship: row.relationship || "",
        place_of_birth: row.place_of_birth || "",
        date_of_birth: row.date_of_birth || "",
        signature: row.signature || "",
    });
};

const handleCancelNextOfKinEdit = () => {
    setEditingNextOfKinId(null);
    setNewNextOfKin({
        full_name: "",
        relationship: "",
        place_of_birth: "",
        date_of_birth: "",
        signature: "",
    });
};

const handleEditEmergencyContact = (row: any) => {
    setEditingEmergencyContactId(row.id);
    setNewEmergencyContact({
        full_name: row.full_name || "",
        relationship: row.relationship || "",
        phone: row.phone || "",
        email: row.email || "",
        address: row.address || "",
    });
};

const handleCancelEmergencyContactEdit = () => {
    setEditingEmergencyContactId(null);
    setNewEmergencyContact({
        full_name: "",
        relationship: "",
        phone: "",
        email: "",
        address: "",
    });
};
