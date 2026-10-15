// Generated instance test for the entity1 entity.

#include "ctest.h"

int main(void) {
  ObsidianSDK* sdk = test_sdk(NULL, NULL);
  CHECK(sdk != NULL, "sdk constructed");

  Entity* e = obsidian_entity1(sdk, NULL);
  CHECK(e != NULL, "entity instance");
  CHECK_STR_EQ(e->vt->get_name(e), "entity1", "entity get_name");

  if (!v_is_noval(getp(getp(shared_config(), "feature"), "validate"))) {
    PNError* verr = NULL;
    Entity* ve = obsidian_entity1(test_sdk(NULL, cmap(1, "feature",
      cmap(1, "validate", cmap(1, "active", v_bool(true))))), NULL);
    ve->vt->load(ve, cmap(1, "authenticated", v_str("x")), NULL, &verr);
    CHECK(NULL != verr && 0 == strcmp(verr->code, "validate_failed"),
      "an invalid request fails with validate_failed");
  }

  TEST_SUMMARY("entity1_entity");
}
